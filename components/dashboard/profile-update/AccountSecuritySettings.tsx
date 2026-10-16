import SocialSettingsCard from '@/components/apple/SocialSettingsCard';
import UpdatePassword from '@/app/dashboard/update-password/UpdatePassword';
import styles from './AccountSecuritySettings.module.css';

export default function AccountSecuritySettings() {
  return <div className={styles.grid}>
    <div className={styles.password}><UpdatePassword /></div>
    <div className={styles.connections}><SocialSettingsCard /></div>
  </div>;
}
