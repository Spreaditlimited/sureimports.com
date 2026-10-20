'use client';

import { FeatureLink as Link, useFeatureVisibility } from '@/components/dashboard/features/FeatureAvailability';
import { ArrowRight, FileText, Package, Ship, ShoppingBag, Truck, Wallet } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useRecord } from '@/app/context/RecordCountProcurementContext';
import CreateOrder from './procurement/create-order/components/createOrder';
import styles from './DashboardOverview.module.css';

const statuses = [
  { label: 'Saved orders', key: 'savedOrderCount', status: 'saved', detail: 'Continue where you left off', icon: FileText },
  { label: 'Awaiting purchase', key: 'pendingOrderCount', status: 'pending', detail: 'Orders submitted for purchase', icon: ShoppingBag },
  { label: 'In transit', key: 'inTransitOrderCount', status: 'in-transit', detail: 'On the way to you', icon: Truck },
  { label: 'Ready for pickup', key: 'readyForPickupOrderCount', status: 'ready-for-pickup', detail: 'View collection details', icon: Package },
] as const;

export default function DashboardOverview() {
  const { user } = useAuth();
  const visible = useFeatureVisibility();
  const { recordx } = useRecord();
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Your workspace</p>
          <h1>{user?.userFirstname ? `Welcome back, ${user.userFirstname}.` : 'Welcome to your dashboard.'}</h1>
          <p>Keep your purchases, shipments and next steps in one place.</p>
        </div>
        {visible('/dashboard/procurement') && <CreateOrder className={styles.create} />}
      </header>

      {visible('/dashboard/procurement') && <section aria-labelledby="procurement-overview">
        <div className={styles.sectionHeading}>
          <h2 id="procurement-overview">Your procurement orders</h2>
          <Link href="/dashboard/procurement/view-orders/saved">All orders <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className={styles.stats}>
          {statuses.map(({ label, key, status, detail, icon: Icon }) => (
            <Link key={key} href={`/dashboard/procurement/view-orders/${status}`} className={styles.stat}>
              <span className={styles.statLabel}><Icon size={18} aria-hidden="true" />{label}</span>
              <strong aria-label={recordx ? `${recordx[key]} orders` : 'Order count loading'}>{recordx ? recordx[key] : '—'}</strong>
              <span className={styles.statDetail}>{detail}<ArrowRight size={15} aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </section>}

      <div className={styles.columns}>
        <section className={styles.panel} aria-labelledby="next-step">
          <div className={styles.sectionHeading}><h2 id="next-step">What would you like to do?</h2></div>
          <Link className={styles.action} href="/dashboard/procurement">
            <span className={styles.icon}><ShoppingBag size={21} aria-hidden="true" /></span>
            <span><strong>Buy from Chinese websites</strong><small>Add product links and let us handle the purchase.</small></span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link className={styles.action} href="/dashboard/shipping-only">
            <span className={styles.icon}><Ship size={21} aria-hidden="true" /></span>
            <span><strong>Ship products you’ve already bought</strong><small>Arrange shipping from China to your destination.</small></span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link className={styles.action} href="/dashboard/shop">
            <span className={styles.icon}><Package size={21} aria-hidden="true" /></span>
            <span><strong>Browse the shop</strong><small>Explore phones, laptops and everyday tech.</small></span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </section>
        <aside className={styles.panel} aria-labelledby="quick-access">
          <div className={styles.sectionHeading}><h2 id="quick-access">Quick access</h2></div>
          <Link className={styles.shortcut} href="/dashboard/wallet"><Wallet size={18} aria-hidden="true" />Wallet<ArrowRight size={16} aria-hidden="true" /></Link>
          <Link className={styles.shortcut} href="/dashboard/my-invoices"><FileText size={18} aria-hidden="true" />Invoices<ArrowRight size={16} aria-hidden="true" /></Link>
          <Link className={styles.shortcut} href="/dashboard/vehicles"><Truck size={18} aria-hidden="true" />Vehicle orders<ArrowRight size={16} aria-hidden="true" /></Link>
          <div className={styles.help}>
            <h3>New to importing?</h3>
            <p>See how to find products, submit links and place your first order.</p>
            <Link href="/buy-from-chinese-websites#how-it-works">Watch the guide <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
