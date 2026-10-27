import { Lesson } from '../types/eco';

export const LESSONS: Lesson[] = [
  {
    id: 'residuos',
    title: '1. ¿Qué son los residuos?',
    shortDesc: 'Aprende qué pasa con las cosas que dejamos de usar y por qué no todo es "basura".',
    icon: '✨',
    badgeName: 'Detective de Residuos',
    sections: [
      {
        subtitle: '¿Basura o Residuo?',
        text: 'Muchas veces llamamos "basura" a todo lo que botamos, ¡pero en realidad muchos son residuos valiosos! Un residuo es cualquier objeto o material que ya cumplió su función original, pero que aún puede tener una segunda vida.',
        emoji: '🧐',
      },
      {
        subtitle: 'El viaje de las cosas',
        text: 'Cuando botamos todo revuelto en una sola bolsa, se pudre y se convierte en basura que contamina. Pero si lo separamos desde el salón o la cafetería, permitimos que se transforme en nuevos objetos mágicos.',
        emoji: '🌍',
        bullets: [
          'Una botella de plástico puede convertirse en una camiseta deportiva o en un juguete.',
          'Una hoja de papel usada puede volver a ser papel nuevo hasta 7 veces.',
          'Una cáscara de plátano puede convertirse en abono que alimente a un árbol frutal.',
        ],
      },
    ],
    funFact: '¿Sabías que más del 70% de lo que botamos en el colegio puede ser reciclado o aprovechado si lo separamos bien?',
  },
  {
    id: 'canecas',
    title: '2. Las 3 Canecas Mágicas',
    shortDesc: 'Conoce el código de colores oficial (Blanca, Verde y Negra) y los Puntos Especiales.',
    icon: '🎨',
    badgeName: 'Maestro del Color',
    sections: [
      {
        subtitle: '⚪ Caneca Blanca: Residuos Aprovechables',
        text: 'Aquí van los materiales limpios y secos que los recicladores pueden transformar: botellas plásticas, cajas de cartón, papel, latas de metal y botellas de vidrio. ¡Recuerda: limpios y sin restos de jugo o comida!',
        emoji: '🤍',
        bullets: [
          'Botellas plásticas y envases PET limpios',
          'Hojas de papel y cartón seco',
          'Latas de jugo y latas de atún enjuagadas',
          'Envases de vidrio y tetra pak escurridos',
        ],
      },
      {
        subtitle: '🟢 Caneca Verde: Residuos Orgánicos Aprovechables',
        text: 'Es la caneca de la comida natural. Aquí van las cáscaras de frutas, sobras de verduras, coronas de piña y hojarasca de jardín. Esta materia orgánica viaja al compostador escolar para crear abono para las flores.',
        emoji: '💚',
        bullets: [
          'Cáscaras de plátano, manzana, naranja y mango',
          'Restos de zanahoria, lechuga y vegetales',
          'Hojas secas barridas de los jardines escolares',
        ],
      },
      {
        subtitle: '⚫ Caneca Negra: Residuos No Aprovechables',
        text: 'Aquí va lo que ya no se puede salvar ni reciclar y debe ir al relleno sanitario: servilletas sucias con grasa, papel higiénico, paquetes de papitas con salsas y el barrido de suciedad del aula.',
        emoji: '🖤',
        bullets: [
          'Servilletas de comida grasosas',
          'Papel higiénico y pañitos húmedos usados',
          'Empaques metalizados de papas y galletas sucios',
          'Polvo del barrido del salón',
        ],
      },
      {
        subtitle: '🔴 ¡Punto Especial! (Pilas y Baterías)',
        text: '¡OJO! Las pilas, baterías y celulares dañados NUNCA van en las 3 canecas comunes. Deben depositarse en contenedores rojos o especiales de recolección de pilas porque tienen químicos peligrosos que dañan el agua.',
        emoji: '🔋',
      },
    ],
    funFact: 'En Colombia se usa este código unificado de colores para que todos sepamos reciclar igual en colegios, parques y hogares.',
  },
  {
    id: 'tres_r',
    title: '3. La Regla de las 3R',
    shortDesc: 'Reducir, Reutilizar y Reciclar: los tres superpoderes del Eco-Estudiante.',
    icon: '♻️',
    badgeName: 'Superhéroe de las 3R',
    sections: [
      {
        subtitle: '1. REDUCIR (¡El superpoder más fuerte!)',
        text: 'Significa generar menos residuos desde el principio. Por ejemplo: lleva un termo recargable de agua en lugar de comprar botellas plásticas desechables todos los días. ¡El mejor residuo es el que no se genera!',
        emoji: '📉',
        bullets: [
          'Usa lonchera con recipientes lavables en lugar de bolsitas plásticas de un solo uso.',
          'Pide solo lo que te vas a comer en el almuerzo escolar para no desperdiciar comida.',
        ],
      },
      {
        subtitle: '2. REUTILIZAR (¡Dar una segunda vida!)',
        text: 'Usa los objetos tantas veces como sea posible antes de botarlos. Si una hoja tiene un lado en blanco, úsala para hacer borradores de matemáticas o dibujos para tus amigos.',
        emoji: '🔁',
        bullets: [
          'Convierte frascos de vidrio limpios en portalápices de colores.',
          'Usa cajas de zapatos para guardar tus juguetes o materiales de arte.',
        ],
      },
      {
        subtitle: '3. RECICLAR (¡Transformación mágica!)',
        text: 'Es cuando depositamos los materiales en la caneca correcta para que las fábricas los limpien, muelan y fundan para crear productos totalmente nuevos.',
        emoji: '🔄',
      },
    ],
    funFact: 'Al reciclar una sola tonelada de papel, evitamos talar 17 árboles adultos y ahorramos miles de litros de agua.',
  },
  {
    id: 'agua_energia',
    title: '4. Misión Ahorro: Agua y Energía',
    shortDesc: 'Pequeñas acciones cotidianas que salvan ríos y evitan el calentamiento global.',
    icon: '💡',
    badgeName: 'Guardián de la Energía',
    sections: [
      {
        subtitle: 'Cada gota cuenta 💧',
        text: 'El agua dulce es uno de los tesoros más valiosos del planeta. En el colegio, asegúrate de cerrar bien el grifo cuando te enjabones las manos y avisa de inmediato si ves un bebedero goteando.',
        emoji: '🚿',
        bullets: [
          'Cierra la llave mientras te cantas mentalmente "Feliz Cumpleaños" al lavarte las manos con jabón.',
          'Si te sobra agua limpia en tu termo al salir del colegio, riégala en las plantas del jardín.',
        ],
      },
      {
        subtitle: 'Luz inteligente en el aula ⚡',
        text: 'Aprovecha la luz natural del sol abriendo las cortinas del salón. Cuando salgan al recreo o a educación física, asegúrate de apagar las luces y los ventiladores.',
        emoji: '☀️',
      },
    ],
    funFact: 'Un grifo que gotea una gota por segundo puede desperdiciar más de 30 litros de agua limpia cada día.',
  },
  {
    id: 'zonas_verdes',
    title: '5. Cuidado de las Zonas Verdes',
    shortDesc: 'Las plantas y árboles son los pulmones de nuestra escuela y el hogar de animales.',
    icon: '🌱',
    badgeName: 'Amigo del Bosque',
    sections: [
      {
        subtitle: 'Los árboles son aire puro',
        text: 'Los árboles y plantas absorben el dióxido de carbono y nos devuelven oxígeno fresco para respirar mientras estudiamos y jugamos. Además, dan sombra deliciosa en los días calurosos.',
        emoji: '🌳',
      },
      {
        subtitle: 'Cómo proteger nuestros jardines escolares',
        text: 'Camina por los senderos y evita pisar las plantas pequeñas. Nunca arranques hojas por diversión ni arrojes basura entre los arbustos.',
        emoji: '🦋',
        bullets: [
          'Participa en las jornadas de siembra y huerto del colegio.',
          'Riega las plantas por la mañana temprano o por la tarde para que el sol no evapore el agua.',
          'Observa los insectos benéficos como abejas y mariquitas sin molestarlos; ellos polinizan las flores.',
        ],
      },
    ],
    funFact: 'Un solo árbol grande en el patio del colegio puede producir suficiente oxígeno para una clase completa de niños.',
  },
  {
    id: 'acciones_diarias',
    title: '6. Acciones Ecológicas de Todos los Días',
    shortDesc: 'Guía rápida para convertirte en el mejor Eco-Estudiante de tu salón.',
    icon: '⭐',
    badgeName: 'Líder Verde de Clase',
    sections: [
      {
        subtitle: 'Rutina del Eco-Estudiante Ejemplar',
        text: 'Cuidar el colegio no requiere superpoderes de ficción, ¡solo constancia y buenas intenciones en tu día a día!',
        emoji: '🎒',
        bullets: [
          'Al sonar la campana de salida, mira debajo de tu pupitre y deja tu puesto impecable.',
          'Usa tus lápices y borradores hasta el final antes de pedir unos nuevos.',
          'Si ves una basura en el pasillo, no digas "yo no la tiré": recógela con orgullo y ponla en su caneca.',
          'Invita a tus amigos y profesores con una sonrisa a separar los residuos en la cafetería.',
          'Comparte tus conocimientos ecológicos con tu familia en casa.',
        ],
      },
    ],
    funFact: 'Las grandes transformaciones de nuestro planeta comienzan con niños que cuidan su propio salón de clases.',
  },
];
