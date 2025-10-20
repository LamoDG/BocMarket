# BocMarket 🎵

Una aplicación móvil React Native para gestionar la tienda de merchandising de un grupo musical. La aplicación funciona completamente offline usando almacenamiento local.

## Características

### 🏪 Gestión de Tienda
- **Gestión de Productos**: Añadir, editar y eliminar productos con nombre, precio y cantidad
- **Control de Inventario**: Seguimiento de stock con indicadores visuales para productos sin stock o con stock bajo
- **Carrito de Compras**: Añadir productos al carrito y procesar compras
- **Funcionamiento Offline**: Funciona sin conexión a internet usando AsyncStorage

### 📱 Interfaz de Usuario
- Diseño moderno y limpio optimizado para tablets y móviles
- Navegación intuitiva entre gestión de productos y tienda
- Indicadores visuales claros para el estado del stock
- Diseño responsivo para diferentes tamaños de pantalla

## Tecnologías Utilizadas

- **React Native** con Expo
- **AsyncStorage** para persistencia de datos local
- **React Native Vector Icons** para elementos de UI

## Estructura del Proyecto

```
BocMarket/
├── src/
│   ├── components/
│   │   ├── Navigation.js      # Navegación principal de la app
│   │   ├── ProductCard.js     # Componente para mostrar productos
│   │   └── Cart.js           # Componente del carrito de compras
│   ├── screens/
│   │   ├── ProductsScreen.js  # Pantalla de gestión de productos
│   │   └── StoreScreen.js     # Pantalla de la tienda
│   ├── styles/
│   │   └── globalStyles.js    # Estilos globales y tema
│   └── utils/
│       └── storage.js         # Utilidades para almacenamiento local
├── App.js                     # Componente principal
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

Desarrollado con ❤️ para la gestión de merchandising musical
