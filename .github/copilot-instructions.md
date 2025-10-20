# Copilot Instructions for BocMarket

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Description
BocMarket is a React Native application for managing a music band's merchandise store. The app is designed to work offline and includes the following features:

### Key Features
- **Product Management**: Add products with name, price, and quantity
- **Inventory Control**: Track stock levels and visual indicators for out-of-stock items
- **Shopping Cart**: Add items to cart and complete purchases
- **Offline Functionality**: Works without internet connection using AsyncStorage

### Technical Stack
- React Native with Expo
- AsyncStorage for local data persistence
- React Native Vector Icons for UI elements

### Code Style Guidelines
- Use functional components with React Hooks
- Implement proper error handling for storage operations
- Keep components small and focused on single responsibilities
- Use meaningful variable and function names in Spanish when appropriate
- Follow React Native best practices for mobile UI/UX

### Data Structure
- Products: { id, name, price, quantity }
- Cart items: { productId, quantity }
- Store all data locally using AsyncStorage keys with "bocmarket_" prefix

### UI Guidelines
- Modern, clean interface suitable for tablets and mobile devices
- Visual indicators for low/no stock products
- Intuitive navigation between product management and store sections
- Responsive design for different screen sizes
