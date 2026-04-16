import { 
  LayoutDashboard, 
  ShieldCheck,
  LayoutGrid,
  MapPin,
  Video,
  PhoneCall,
  Activity,
  Factory,
  Droplets,
  FlaskConical,
  CalendarDays,
  BellRing,
  Waves,
  AlertTriangle,
  Package,
  LineChart,
  Users2,
  FileBarChart,
  Cpu,
  Bot,
  Database,
  UserSquare2,
  History,
  Settings,
  type LucideIcon
} from 'lucide-react';

export interface MenuItem {
  icon: LucideIcon;
  translationKey: string;
  path: string;
  badge?: number;
}

export interface MenuCategory {
  titleKey: string;
  items: MenuItem[];
}

export const menuCategories: MenuCategory[] = [
  {
    titleKey: 'menu.categories.central_command',
    items: [
      { icon: LayoutDashboard, translationKey: 'menu.items.dashboard', path: '/dashboard' },
      { icon: ShieldCheck, translationKey: 'menu.items.approve', path: '/approve', badge: 4 },
      { icon: LayoutGrid, translationKey: 'menu.items.videowall', path: '/videowall' },
      { icon: MapPin, translationKey: 'menu.items.gis', path: '/gis' },
      { icon: Video, translationKey: 'menu.items.camera', path: '/camera' },
      { icon: PhoneCall, translationKey: 'menu.items.callcenter', path: '/callcenter', badge: 2 },
    ]
  },
  {
    titleKey: 'menu.categories.production',
    items: [
      { icon: Activity, translationKey: 'menu.items.scada', path: '/scada' },
      { icon: Factory, translationKey: 'menu.items.plants', path: '/plants' },
      { icon: Droplets, translationKey: 'menu.items.quality', path: '/quality' },
      { icon: FlaskConical, translationKey: 'menu.items.lab', path: '/lab' },
      { icon: CalendarDays, translationKey: 'menu.items.pumpscale', path: '/pumpscale' },
      { icon: BellRing, translationKey: 'menu.items.alertconfig', path: '/alertconfig' },
    ]
  },
  {
    titleKey: 'menu.categories.technical',
    items: [
      { icon: Waves, translationKey: 'menu.items.nrw', path: '/nrw' },
      { icon: AlertTriangle, translationKey: 'menu.items.incidents', path: '/incidents', badge: 2 },
      { icon: Package, translationKey: 'menu.items.inventory', path: '/inventory' },
    ]
  },
  {
    titleKey: 'menu.categories.business',
    items: [
      { icon: LineChart, translationKey: 'menu.items.business_overview', path: '/business' },
      { icon: Users2, translationKey: 'menu.items.customers', path: '/customers' },
      { icon: FileBarChart, translationKey: 'menu.items.reports', path: '/reports' },
    ]
  },
  {
    titleKey: 'menu.categories.ai_center',
    items: [
      { icon: Cpu, translationKey: 'menu.items.ai_agent', path: '/ai-agent' },
      { icon: Bot, translationKey: 'menu.items.ai_assistant', path: '/ai-assistant' },
      { icon: Database, translationKey: 'menu.items.data_hub', path: '/data-hub' },
    ]
  },
  {
    titleKey: 'menu.categories.resources_system',
    items: [
      { icon: UserSquare2, translationKey: 'menu.items.hrm', path: '/hrm' },
      { icon: History, translationKey: 'menu.items.history', path: '/history' },
      { icon: Settings, translationKey: 'menu.items.system_settings', path: '/settings' },
    ]
  }
];

// For backward compatibility and easy lookup
export const menuItems = menuCategories.flatMap(cat => cat.items);
