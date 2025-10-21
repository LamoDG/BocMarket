# BocMarket 🎵

Una aplicación móvil React Native **gratuita** creada por el **grupo de música BOC** para gestionar la tienda de merchandising de manera eficiente. La aplicación funciona completamente offline usando almacenamiento local.

## 🎸 Sobre BOC

**BOC** es un grupo musical comprometido con la creación de música auténtica y la conexión directa con nuestros fans. Como parte de nuestro compromiso con la innovación, desarrollamos nuestras propias herramientas tecnológicas para mejorar tanto nuestra experiencia como artistas como la de nuestro público.

### 🔗 Síguenos
- **Spotify**: [Escucha nuestra música](https://open.spotify.com/artist/2PDFLRIcrPY7IhDWsaKXHO?si=8n0l3gZtRcufXrAYHDYZRA)
- **Instagram**: [@boc.oficial](https://www.instagram.com/boc.oficial/)

## ✨ Características

### 🏪 Gestión de Tienda
- **Gestión de Productos**: Añadir, editar y eliminar productos con nombre, precio y cantidad
- **Control de Inventario**: Seguimiento de stock con indicadores visuales para productos sin stock o con stock bajo
- **Carrito de Compras**: Añadir productos al carrito y procesar compras
- **Funcionamiento Offline**: Funciona sin conexión a internet usando AsyncStorage
- **Caja Diaria**: Sistema completo de punto de venta con reportes en tiempo real
- **Temas**: Modo claro y oscuro para una mejor experiencia visual

### 📱 Interfaz de Usuario
- Diseño moderno y limpio optimizado para tablets y móviles
- Navegación intuitiva entre gestión de productos, tienda, caja y sección BOC
- Indicadores visuales claros para el estado del stock
- Diseño responsivo para diferentes tamaños de pantalla
- **Nueva sección BOC**: Información del grupo con enlaces directos a Spotify e Instagram

## Tecnologías Utilizadas

- **React Native** con Expo
- **AsyncStorage** para persistencia de datos local
- **React Native Vector Icons** para elementos de UI

## Estructura del Proyecto

```
BocMarket/
├── src/
│   ├── components/
│   │   ├── Navigation/          # Navegación principal de la app
│   │   ├── ProductCard/         # Componente para mostrar productos
│   │   ├── Cart/               # Componente del carrito de compras
│   │   ├── DailyCashRegister/  # Sistema de caja diaria
│   │   └── ThemeToggle/        # Selector de temas
│   ├── screens/
│   │   ├── ProductsScreen/     # Pantalla de gestión de productos
│   │   ├── StoreScreen/        # Pantalla de la tienda
│   │   └── AboutScreen/        # Pantalla de información BOC
│   ├── contexts/
│   │   └── ThemeContext/       # Contexto para temas
│   ├── styles/
│   │   └── globalStyles.ts     # Estilos globales y tema
│   └── utils/
│       └── storage.ts          # Utilidades para almacenamiento local
├── App.tsx                     # Componente principal
└── package.json
```

## Instalación y Ejecución

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd BocMarket
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar la aplicación**
   
   Para Android:
   ```bash
   npm run android
   ```
   
   Para iOS (requiere macOS):
   ```bash
   npm run ios
   ```
   
   Para web:
   ```bash
   npm run web
   ```

## Uso de la Aplicación

### Gestión de Productos
1. Ve a la pestaña "Productos"
2. Toca el botón "+" para añadir un nuevo producto
3. Completa el formulario con nombre, precio y cantidad
4. Usa los botones de editar/eliminar para gestionar productos existentes

### Tienda y Ventas
1. Ve a la pestaña "Tienda"
2. Navega por los productos disponibles
3. Añade productos al carrito tocando "Añadir al Carrito"
4. Ve al carrito tocando el botón del carrito
5. Ajusta las cantidades y finaliza la compra

### Caja Diaria
1. Ve a la pestaña "Caja"
2. Consulta las estadísticas de ventas del día
3. Revisa los productos más vendidos
4. Exporta reportes en formato CSV
5. Gestiona devoluciones si es necesario

### Información BOC
1. Ve a la pestaña "BOC"
2. Conoce más sobre el proyecto y el grupo
3. Accede directamente a nuestro Spotify e Instagram
4. Descubre por qué creamos esta aplicación

### Características Especiales
- **Indicadores de Stock**: Los productos se marcan visualmente cuando están sin stock o con stock bajo
- **Validación de Stock**: No puedes añadir más productos al carrito de los que hay en stock
- **Persistencia Offline**: Todos los datos se guardan localmente y persisten entre sesiones

## Estructura de Datos

### Productos
```javascript
{
  id: "timestamp_string",
  name: "Nombre del producto",
  price: 15.99,
  quantity: 50,
  createdAt: "2025-10-20T18:00:00.000Z"
}
```

### Elementos del Carrito
```javascript
{
  productId: "product_id",
  quantity: 2
}
```

## Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo de Expo
- `npm run android` - Ejecuta en Android
- `npm run ios` - Ejecuta en iOS
- `npm run web` - Ejecuta en navegador web

## Requisitos del Sistema

- Node.js 18+ 
- Expo CLI
- Android Studio (para desarrollo Android)
- Xcode (para desarrollo iOS, solo en macOS)

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.

## Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Haz commit de tus cambios (`git commit -am 'Añadir nueva característica'`)
4. Haz push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Soporte

Si encuentras algún problema o tienes preguntas, por favor abre un issue en el repositorio.

---

**Desarrollado con ❤️ por BOC para la gestión de merchandising musical**

## 🎵 Conoce a BOC

¿Te gusta nuestra app? ¡Descubre nuestra música!

- **🎧 Spotify**: [BOC en Spotify](https://open.spotify.com/artist/2PDFLRIcrPY7IhDWsaKXHO?si=8n0l3gZtRcufXrAYHDYZRA)
- **📷 Instagram**: [@boc.oficial](https://www.instagram.com/boc.oficial/)

*Este proyecto es completamente gratuito y open-source, creado con amor por el grupo BOC.*
