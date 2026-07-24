import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Manual de Usuario',
    icon: '📘',
    description: (
      <>
        Aprende a crear tu cuenta, gestionar tu perfil, solicitar una
        membresía y descargar tu constancia.
      </>
    ),
    to: '/manual-usuario/intro',
  },
  {
    title: 'Administración',
    icon: '🛠️',
    description: (
      <>
        Guía para administradores: gestión de solicitudes, miembros, tipos
        de membresía, entidades y estadísticas.
      </>
    ),
    to: '/administracion/panel-administracion',
  },
  {
    title: 'Desarrolladores',
    icon: '💻',
    description: (
      <>
        Documentación técnica del proyecto: arquitectura, cliente API,
        servicios, módulos e internacionalización.
      </>
    ),
    to: '/desarrolladores/arquitectura',
  },
];

function Feature({icon, title, description, to}) {
  return (
    <div className={clsx('col col--4')}>
      <Link to={to} className={styles.featureCard}>
        <div className="text--center">
          <span className={styles.featureIcon}>{icon}</span>
        </div>
        <div className="text--center padding-horiz--md">
          <Heading as="h3">{title}</Heading>
          <p>{description}</p>
        </div>
      </Link>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
