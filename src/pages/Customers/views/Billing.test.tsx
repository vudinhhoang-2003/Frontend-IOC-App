import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import * as fc from 'fast-check';
import Billing from './Billing';
import { apiClient } from '../../../services/apiClient';

// Mock the apiClient
vi.mock('../../../services/apiClient', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// Helper to wrap component with Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

// Helper to create mock invoice data
const createMockInvoice = (overrides: Partial<any> = {}) => ({
  id: overrides.id || 'INV-001',
  invoice_no: overrides.invoice_no || 'INV-001',
  customer_name: overrides.customer_name || 'Test Customer',
  address: overrides.address || '123 Test St',
  period_month: overrides.period_month || '2024-01-01',
  consumption_m3: overrides.consumption_m3 || '10',
  total_amount_vnd: overrides.total_amount_vnd || '100000',
  paid_amount_vnd: overrides.paid_amount_vnd || '0',
  status: overrides.status || 'unpaid',
  display_status: overrides.display_status || overrides.status || 'unpaid',
  issued_at: overrides.issued_at || '2024-01-15',
  paid_at: overrides.paid_at || null,
  payment_method: overrides.payment_method || null,
});

describe('Billing Component - Bug Condition Exploration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Simple unit test to verify the bug exists
   * This test should FAIL on unfixed code
   */
  it('Simple test: Cancelled invoice should display "Đã hủy" badge', async () => {
    // Setup: Mock API responses with a cancelled invoice
    const mockInvoice = createMockInvoice({
      id: 'INV-CANCELLED-001',
      invoice_no: 'INV-CANCELLED-001',
      customer_name: 'Test Customer',
      status: 'cancelled',
      display_status: 'cancelled',
    });
    
    vi.mocked(apiClient.get).mockImplementation((url: string) => {
      if (url === '/invoices') {
        return Promise.resolve({
          data: {
            data: [mockInvoice],
            meta: { total: 1 },
          },
        });
      }
      if (url === '/invoices/summary') {
        return Promise.resolve({
          data: {
            data: {
              collected_amount_vnd: '0',
              outstanding_amount_vnd: '0',
            },
          },
        });
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });

    // Act: Render the Billing component
    renderWithRouter(<Billing />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText('Đang tải...')).not.toBeInTheDocument();
    }, { timeout: 3000 });

    // Assert: Verify the cancelled badge is displayed
    // This will FAIL on unfixed code because no badge is rendered for cancelled status
    const statusBadge = screen.queryByText('Đã hủy');
    expect(statusBadge).toBeInTheDocument();
  }, 10000);

  /**
   * **Property 1: Bug Condition** - Cancelled Status Badge Display
   * **Validates: Requirements 2.1, 2.2, 2.3**
   * 
   * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists
   * 
   * This property-based test verifies that when an invoice has status "cancelled",
   * the status cell displays a "Đã hủy" badge with gray/muted styling.
   * 
   * The test uses property-based testing to generate multiple cancelled invoices
   * with varying properties (different IDs, amounts, dates, etc.) to ensure
   * the bug manifests consistently across all cancelled invoices.
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: Test FAILS
   * - Status cell for cancelled invoice is empty
   * - No badge element found
   * - Text "Đã hủy" is not present
   * 
   * This failure confirms the bug exists and validates our root cause analysis.
   */
  it('Property 1: Cancelled invoices MUST display "Đã hủy" badge with gray styling', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generator: Create arbitrary cancelled invoices with varying properties
        fc.record({
          id: fc.string({ minLength: 5, maxLength: 20 }),
          invoice_no: fc.string({ minLength: 5, maxLength: 20 }),
          customer_name: fc.string({ minLength: 3, maxLength: 50 }),
          address: fc.string({ minLength: 5, maxLength: 100 }),
          total_amount_vnd: fc.integer({ min: 10000, max: 10000000 }).map(String),
          paid_amount_vnd: fc.constant('0'),
          status: fc.constant('cancelled'),
          display_status: fc.constant('cancelled'),
        }),
        async (invoiceData) => {
          // Setup: Mock API responses
          const mockInvoice = createMockInvoice(invoiceData);
          
          vi.mocked(apiClient.get).mockImplementation((url: string) => {
            if (url === '/invoices') {
              return Promise.resolve({
                data: {
                  data: [mockInvoice],
                  meta: { total: 1 },
                },
              });
            }
            if (url === '/invoices/summary') {
              return Promise.resolve({
                data: {
                  data: {
                    collected_amount_vnd: '0',
                    outstanding_amount_vnd: '0',
                  },
                },
              });
            }
            return Promise.reject(new Error('Unknown endpoint'));
          });

          // Act: Render the Billing component
          const { unmount } = renderWithRouter(<Billing />);

          try {
            // Wait for data to load
            await waitFor(() => {
              expect(screen.queryByText('Đang tải...')).not.toBeInTheDocument();
            }, { timeout: 3000 });

            // Assert: Verify the cancelled badge is displayed
            const statusBadge = screen.queryByText('Đã hủy');
            expect(statusBadge).toBeInTheDocument();

            // Assert: Verify the badge has gray/muted styling
            // Check for gray badge class or gray color styling
            const badgeElement = statusBadge?.closest('span');
            expect(badgeElement).toBeTruthy();
            
            // The badge should have either:
            // - badge-gray class, OR
            // - gray background/text color classes (Tailwind: bg-gray-*, text-gray-*)
            const hasGrayClass = 
              badgeElement?.classList.contains('badge-gray') ||
              Array.from(badgeElement?.classList || []).some(
                cls => cls.includes('gray') || cls.includes('muted')
              );
            
            expect(hasGrayClass).toBe(true);
          } finally {
            // Cleanup after each property test run
            unmount();
          }
        }
      ),
      {
        numRuns: 5, // Run 5 test cases with different cancelled invoices
        verbose: true,
      }
    );
  }, 30000);
});

describe('Billing Component - Preservation Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * **Property 2: Preservation** - Existing Status Badge Rendering
   * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**
   * 
   * IMPORTANT: These tests verify baseline behavior on UNFIXED code
   * 
   * These property-based tests verify that existing status badge rendering
   * for paid, partial, and unpaid invoices works correctly BEFORE the fix.
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: Tests PASS
   * - This confirms the baseline behavior we need to preserve
   * - After implementing the fix, these tests should still pass (no regressions)
   */

  /**
   * Preservation Test 1: Paid invoices display green "Đã thu" badge
   * **Validates: Requirement 3.1**
   */
  it('Property 2.1: Paid invoices MUST display "Đã thu" badge with green styling', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generator: Create arbitrary paid invoices with varying properties
        fc.record({
          id: fc.string({ minLength: 5, maxLength: 20 }),
          invoice_no: fc.string({ minLength: 5, maxLength: 20 }),
          customer_name: fc.string({ minLength: 3, maxLength: 50 }),
          address: fc.string({ minLength: 5, maxLength: 100 }),
          total_amount_vnd: fc.integer({ min: 10000, max: 10000000 }).map(String),
          paid_amount_vnd: fc.integer({ min: 10000, max: 10000000 }).map(String),
          status: fc.constant('paid'),
          display_status: fc.constant('paid'),
          paid_at: fc.constant('2024-01-20'),
          payment_method: fc.constantFrom('bank_transfer', 'cash', 'e_wallet'),
        }),
        async (invoiceData) => {
          // Setup: Mock API responses
          const mockInvoice = createMockInvoice(invoiceData);
          
          vi.mocked(apiClient.get).mockImplementation((url: string) => {
            if (url === '/invoices') {
              return Promise.resolve({
                data: {
                  data: [mockInvoice],
                  meta: { total: 1 },
                },
              });
            }
            if (url === '/invoices/summary') {
              return Promise.resolve({
                data: {
                  data: {
                    collected_amount_vnd: invoiceData.paid_amount_vnd,
                    outstanding_amount_vnd: '0',
                  },
                },
              });
            }
            return Promise.reject(new Error('Unknown endpoint'));
          });

          // Act: Render the Billing component
          const { unmount, container } = renderWithRouter(<Billing />);

          try {
            // Wait for data to load
            await waitFor(() => {
              expect(screen.queryByText('Đang tải...')).not.toBeInTheDocument();
            }, { timeout: 3000 });

            // Assert: Verify the paid badge is displayed in the table
            // Query within tbody to avoid matching the summary card
            const tbody = container.querySelector('tbody');
            expect(tbody).toBeTruthy();
            
            const statusCell = tbody?.querySelector('td:nth-child(6)'); // Status column is 6th
            expect(statusCell).toBeTruthy();
            
            const statusBadge = statusCell?.querySelector('.badge-green');
            expect(statusBadge).toBeTruthy();
            expect(statusBadge?.textContent).toBe('Đã thu');
          } finally {
            // Cleanup after each property test run
            unmount();
          }
        }
      ),
      {
        numRuns: 5, // Run 5 test cases with different paid invoices
        verbose: true,
      }
    );
  }, 30000);

  /**
   * Preservation Test 2: Partial invoices display yellow "Một phần" badge
   * **Validates: Requirement 3.2**
   */
  it('Property 2.2: Partial invoices MUST display "Một phần" badge with yellow styling', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generator: Create arbitrary partial invoices with varying properties
        fc.record({
          id: fc.string({ minLength: 5, maxLength: 20 }),
          invoice_no: fc.string({ minLength: 5, maxLength: 20 }),
          customer_name: fc.string({ minLength: 3, maxLength: 50 }),
          address: fc.string({ minLength: 5, maxLength: 100 }),
          total_amount_vnd: fc.integer({ min: 100000, max: 10000000 }).map(String),
          paid_amount_vnd: fc.integer({ min: 10000, max: 99999 }).map(String),
          status: fc.constant('partial'),
          display_status: fc.constant('partial'),
          paid_at: fc.constant('2024-01-20'),
          payment_method: fc.constantFrom('bank_transfer', 'cash', 'e_wallet'),
        }),
        async (invoiceData) => {
          // Setup: Mock API responses
          const mockInvoice = createMockInvoice(invoiceData);
          
          vi.mocked(apiClient.get).mockImplementation((url: string) => {
            if (url === '/invoices') {
              return Promise.resolve({
                data: {
                  data: [mockInvoice],
                  meta: { total: 1 },
                },
              });
            }
            if (url === '/invoices/summary') {
              return Promise.resolve({
                data: {
                  data: {
                    collected_amount_vnd: invoiceData.paid_amount_vnd,
                    outstanding_amount_vnd: String(
                      parseInt(invoiceData.total_amount_vnd) - parseInt(invoiceData.paid_amount_vnd)
                    ),
                  },
                },
              });
            }
            return Promise.reject(new Error('Unknown endpoint'));
          });

          // Act: Render the Billing component
          const { unmount, container } = renderWithRouter(<Billing />);

          try {
            // Wait for data to load
            await waitFor(() => {
              expect(screen.queryByText('Đang tải...')).not.toBeInTheDocument();
            }, { timeout: 3000 });

            // Assert: Verify the partial badge is displayed in the table
            // Query within tbody to avoid matching other elements
            const tbody = container.querySelector('tbody');
            expect(tbody).toBeTruthy();
            
            const statusCell = tbody?.querySelector('td:nth-child(6)'); // Status column is 6th
            expect(statusCell).toBeTruthy();
            
            const statusBadge = statusCell?.querySelector('.badge-yellow');
            expect(statusBadge).toBeTruthy();
            expect(statusBadge?.textContent).toBe('Một phần');
          } finally {
            // Cleanup after each property test run
            unmount();
          }
        }
      ),
      {
        numRuns: 5, // Run 5 test cases with different partial invoices
        verbose: true,
      }
    );
  }, 30000);

  /**
   * Preservation Test 3: Unpaid invoices display red "Chưa thu" badge
   * **Validates: Requirement 3.3**
   */
  it('Property 2.3: Unpaid invoices MUST display "Chưa thu" badge with red styling', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generator: Create arbitrary unpaid invoices with varying properties
        fc.record({
          id: fc.string({ minLength: 5, maxLength: 20 }),
          invoice_no: fc.string({ minLength: 5, maxLength: 20 }),
          customer_name: fc.string({ minLength: 3, maxLength: 50 }),
          address: fc.string({ minLength: 5, maxLength: 100 }),
          total_amount_vnd: fc.integer({ min: 10000, max: 10000000 }).map(String),
          paid_amount_vnd: fc.constant('0'),
          status: fc.constant('unpaid'),
          display_status: fc.constant('unpaid'),
        }),
        async (invoiceData) => {
          // Setup: Mock API responses
          const mockInvoice = createMockInvoice(invoiceData);
          
          vi.mocked(apiClient.get).mockImplementation((url: string) => {
            if (url === '/invoices') {
              return Promise.resolve({
                data: {
                  data: [mockInvoice],
                  meta: { total: 1 },
                },
              });
            }
            if (url === '/invoices/summary') {
              return Promise.resolve({
                data: {
                  data: {
                    collected_amount_vnd: '0',
                    outstanding_amount_vnd: invoiceData.total_amount_vnd,
                  },
                },
              });
            }
            return Promise.reject(new Error('Unknown endpoint'));
          });

          // Act: Render the Billing component
          const { unmount, container } = renderWithRouter(<Billing />);

          try {
            // Wait for data to load
            await waitFor(() => {
              expect(screen.queryByText('Đang tải...')).not.toBeInTheDocument();
            }, { timeout: 3000 });

            // Assert: Verify the unpaid badge is displayed in the table
            // Query within tbody to avoid matching other elements
            const tbody = container.querySelector('tbody');
            expect(tbody).toBeTruthy();
            
            const statusCell = tbody?.querySelector('td:nth-child(6)'); // Status column is 6th
            expect(statusCell).toBeTruthy();
            
            const statusBadge = statusCell?.querySelector('.badge-red');
            expect(statusBadge).toBeTruthy();
            expect(statusBadge?.textContent).toBe('Chưa thu');
          } finally {
            // Cleanup after each property test run
            unmount();
          }
        }
      ),
      {
        numRuns: 5, // Run 5 test cases with different unpaid invoices
        verbose: true,
      }
    );
  }, 30000);

  /**
   * Preservation Test 4: Action button visibility for non-cancelled invoices
   * **Validates: Requirements 3.4, 3.5, 3.6**
   * 
   * This test verifies that action buttons display correctly for different statuses:
   * - Paid: Payment button hidden, cancel button hidden
   * - Unpaid: Payment button shown, cancel button shown
   * - Partial: Payment button shown, cancel button hidden (partial is treated like paid for cancel)
   */
  it('Property 2.4: Action buttons MUST display correctly for non-cancelled invoices', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generator: Create invoices with different statuses
        fc.constantFrom('paid', 'unpaid', 'partial').chain(status => {
          const isPaid = status === 'paid';
          const isPartial = status === 'partial';
          return fc.record({
            id: fc.string({ minLength: 5, maxLength: 20 }),
            invoice_no: fc.string({ minLength: 5, maxLength: 20 }),
            customer_name: fc.string({ minLength: 3, maxLength: 50 }),
            total_amount_vnd: fc.integer({ min: 10000, max: 10000000 }).map(String),
            paid_amount_vnd: isPaid 
              ? fc.integer({ min: 10000, max: 10000000 }).map(String)
              : isPartial
              ? fc.integer({ min: 1000, max: 9999 }).map(String)
              : fc.constant('0'),
            status: fc.constant(status),
            display_status: fc.constant(status),
            paid_at: isPaid || isPartial ? fc.constant('2024-01-20') : fc.constant(null),
            payment_method: isPaid || isPartial 
              ? fc.constantFrom('bank_transfer', 'cash', 'e_wallet')
              : fc.constant(null),
          });
        }),
        async (invoiceData) => {
          // Setup: Mock API responses
          const mockInvoice = createMockInvoice(invoiceData);
          
          vi.mocked(apiClient.get).mockImplementation((url: string) => {
            if (url === '/invoices') {
              return Promise.resolve({
                data: {
                  data: [mockInvoice],
                  meta: { total: 1 },
                },
              });
            }
            if (url === '/invoices/summary') {
              return Promise.resolve({
                data: {
                  data: {
                    collected_amount_vnd: invoiceData.paid_amount_vnd,
                    outstanding_amount_vnd: String(
                      parseInt(invoiceData.total_amount_vnd) - parseInt(invoiceData.paid_amount_vnd)
                    ),
                  },
                },
              });
            }
            return Promise.reject(new Error('Unknown endpoint'));
          });

          // Act: Render the Billing component
          const { unmount, container } = renderWithRouter(<Billing />);

          try {
            // Wait for data to load
            await waitFor(() => {
              expect(screen.queryByText('Đang tải...')).not.toBeInTheDocument();
            }, { timeout: 3000 });

            // Find the table row for this invoice
            const row = container.querySelector('tbody tr');
            expect(row).toBeTruthy();

            // Hover over the row to make action buttons visible
            // Note: In the actual UI, buttons have opacity-0 group-hover:opacity-100
            // In tests, we check for the presence of buttons regardless of opacity
            
            // Check for payment button (CreditCard icon)
            const paymentButtons = container.querySelectorAll('[title="Thanh toán"]');
            
            // Check for cancel button (Ban icon)
            const cancelButtons = container.querySelectorAll('[title="Hủy HĐ"]');

            // Assert based on status
            if (invoiceData.status === 'paid') {
              // Paid: No payment button, no cancel button
              expect(paymentButtons.length).toBe(0);
              expect(cancelButtons.length).toBe(0);
            } else if (invoiceData.status === 'unpaid') {
              // Unpaid: Payment button shown, cancel button shown
              expect(paymentButtons.length).toBe(1);
              expect(cancelButtons.length).toBe(1);
            } else if (invoiceData.status === 'partial') {
              // Partial: Payment button shown (can pay remaining), no cancel button
              expect(paymentButtons.length).toBe(1);
              expect(cancelButtons.length).toBe(0);
            }
          } finally {
            // Cleanup after each property test run
            unmount();
          }
        }
      ),
      {
        numRuns: 5, // Run 5 test cases with different statuses
        verbose: true,
      }
    );
  }, 30000);
});
