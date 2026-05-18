export type Service = {
  title: string;
  slug: string;
  description: string;
  highlights: string[];
};

export const services: Service[] = [
  {
    title: "Instalacion certificada",
    slug: "instalacion-certificada",
    description:
      "Visita tecnica, calculo de potencia, montaje limpio y puesta en marcha.",
    highlights: [
      "Certificación oficial y montaje seguro",
      "Puesta en marcha y comprobación de rendimiento",
      "Instalación sin daños y con acabado profesional",
    ],
  },
  {
    title: "Mantenimiento",
    slug: "mantenimiento",
    description:
      "Limpieza, revision de gas, filtros y control de rendimiento estacional.",
    highlights: [
      "Revisión completa de circuitos y gas",
      "Limpieza profunda de filtros y serpentines",
      "Ajuste de rendimiento para menor consumo",
    ],
  },
  {
    title: "Reparacion y diagnostico",
    slug: "reparacion-diagnostico",
    description:
      "Localizamos averias, fugas y problemas de rendimiento con criterio tecnico.",
    highlights: [
      "Diagnóstico preciso con herramientas técnicas",
      "Reparaciones rápidas y piezas de calidad",
      "Informe claro con recomendaciones de mejora",
    ],
  },
];

export const categories = [
  {
    title: "Split mural",
    description: "Soluciones silenciosas para dormitorios, salones y oficinas.",
  },
  {
    title: "Conductos",
    description: "Climatizacion integrada para viviendas completas y reformas.",
  },
  {
    title: "Locales comerciales",
    description: "Equipos robustos para tiendas, restaurantes y espacios de trabajo.",
  },
];

export const steps = [
  "Cuentanos el espacio",
  "Elegimos el equipo adecuado",
  "Instalamos y verificamos",
];
