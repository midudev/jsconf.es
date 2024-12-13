# JSConf España 2025 - Sitio Web Oficial

![CleanShot 2024-12-06 at 11 08 41@2x](https://github.com/user-attachments/assets/04fac705-fc4b-40ba-9d6f-133bcefcb8d7)

Este es el repositorio oficial del sitio web de JSConf España 2025, la conferencia internacional de JavaScript más importante de España que se celebrará el 1 de Marzo de 2025 en La Nave, Madrid.

[🖼️ Diseño en Figma](https://www.figma.com/design/cLUljIwWWJil5ESwyWJrbH/JSConf-%7C-2025?node-id=0-1&node-type=canvas&t=aMr2371pM1bFreOo-0)

## 🚀 Sobre el Proyecto

Este proyecto es una iniciativa de [midudev](https://twitch.tv/midudev) para crear el sitio web oficial de JSConf España. La web está construida utilizando tecnologías modernas

### 📝 Licencia del Proyecto

Ten en cuenta que este proyecto es de código abierto y abierto a contribuciones de la comunidad pero **su licencia no permite trabajos derivados, ni gratuitos ni comerciales**. Revisa el archivo [LICENSE.md](LICENSE.md) para más información.

### 🛠️ Tecnologías

- [Astro 5](https://astro.build)
- [TailwindCSS](https://tailwindcss.com)

## 🔧 Instalación

Instala las dependencias

```sh
pnpm install
```

Inicia el proyecto en modo desarrollo

```sh
pnpm run dev
```

## 🤝 Cómo Contribuir

1. Haz un Fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add: AmazingFeature'`)
4. Haz Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

> Nota: antes de codificar una nueva funcionalidad ve a la sección de issues y PRs del repositorio y verifica que ya no se esté discutiendo sobre ese tema, o que ya otra persona no lo haya relizado.

### 📋 Estándares de Código

#### Commits

Si es posible describe tus proyectos para que los mantenedores los puedan analizar de una forma más rápida y eficiente.

- `feat:` - Nuevas características
- `fix:` - Correcciones de bugs
- `docs:` - Cambios en documentación
- `style:` - Cambios que no afectan el código (espacios, formato, etc)
- `refactor:` - Refactorización del código
- `test:` - Añadir o modificar tests
- `chore:` - Cambios en el proceso de build o herramientas auxiliares

Ejemplo: `feat: add newsletter subscription component`

#### Código

- Utiliza en lo posible el estilo de codificación configurado
- Nombra las variables y funciones en camelCase
- Utiliza nombres descriptivos en variables y funciones
- Los componentes de Astro deben ir en PascalCase
- Comenta tu código cuando solo sea necesario
- Sigue las reglas de ESLint configuradas en el proyecto

#### CSS/TailwindCSS

- Utiliza las clases de Tailwind siempre que sea posible
- Evita CSS personalizado a menos que sea absolutamente necesario

#### Pull Requests

- Describe claramente los cambios realizados
- Incluye capturas de pantalla si hay cambios visuales
- Asegúrate de que los tests pasen
- Referencia los issues relacionados si los hay
- Mantén los PR pequeños y enfocados en una sola característica

### Formas de contribuir

- Todos los aportes son importantes
- Codificación
- Pruebas manuales o automatizadas
- Traducciones, correcciones ortográficas

### 🚫 Qué evitar

- No hagas commit directamente a `main`
- No uses `!important` en CSS
- No dejes console.logs en el código
- No añadas dependencias sin discutirlo primero
- No modifiques la configuración del proyecto sin consenso
- Evita ser grosero o imponerte en las discusiones

### 👥 Proceso de Review

1. Los PR necesitan al menos una aprobación
2. Atiende los comentarios del review
3. Asegúrate de que el CI/CD pase
