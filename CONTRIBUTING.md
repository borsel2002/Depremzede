# Contributing to Earthquake Rescue Locator

Thank you for considering contributing to the Earthquake Rescue Locator project! This is an open-source humanitarian project aimed at saving lives during disasters, and your help is greatly appreciated.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone. Please be considerate of differing viewpoints and experiences, and focus on what is best for the community and the people this project aims to help.

## How Can I Contribute?

### Reporting Bugs

If you find a bug in the application, please create an issue with the following information:
- A clear, descriptive title
- Steps to reproduce the bug
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Your environment (browser, OS, device)

### Suggesting Enhancements

We welcome suggestions for improvements! When suggesting an enhancement, please:
- Use a clear, descriptive title
- Provide a detailed description of the proposed enhancement
- Explain why this enhancement would be useful to the project
- Consider including mockups or examples

### Pull Requests

1. Fork the repository
2. Create a new branch for your feature or bugfix
3. Make your changes
4. Test your changes thoroughly
5. Submit a pull request with a clear description of the changes

## Development Setup

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm start`
4. Access the application at http://localhost:3000

## Project Structure

- `/css` - Stylesheets
- `/js` - JavaScript files
  - `app.js` - Main application logic
  - `map.js` - Map functionality
  - `i18n.js` - Internationalization
  - `config.js` - Configuration settings
  - `sw-register.js` - Service worker registration (currently disabled)
- `/images` - Image assets
- `index.html` - Main HTML file
- `service-worker.js` - Service worker for offline functionality (minimal implementation)
- `manifest.json` - PWA manifest
- `server.js` - Express server for local development

## Application Architecture

The application uses a fully client-side architecture with the following key components:

1. **Local Storage**: All report data is stored in the browser's localStorage API
2. **Peer-to-Peer Communication**: The BroadcastChannel API is used for communication between instances
3. **Community Verification**: Reports require 3 different votes to be marked as verified
4. **Community Resolution**: Reports require 5 different votes to be marked as resolved
5. **Offline Support**: The application works offline with minimal service worker functionality

## Coding Guidelines

- Write clear, readable, and well-commented code
- Follow existing code style and patterns
- Keep accessibility in mind
- Optimize for mobile and low-bandwidth environments
- Consider offline functionality for disaster scenarios
- Avoid adding external API dependencies

## Localization

This project aims to be accessible globally. If you can help with translations to additional languages, please:
1. Add new language entries to the translations object in `js/i18n.js`
2. Add the language option to the language selector in `index.html`
3. Add the language code to the supportedLanguages array in `js/config.js`

## Testing

Before submitting a pull request, please test your changes:
- Test on multiple browsers (Chrome, Firefox, Safari)
- Test on mobile devices or using responsive design tools
- Test offline functionality
- Test with screen readers for accessibility
- Test the peer-to-peer functionality with multiple browser windows
- Test the community verification and resolution system

## Documentation

If you make significant changes, please update the relevant documentation.

## Questions?

If you have any questions about contributing, please open an issue labeled "question".

Thank you for helping make this project better and potentially saving lives during disasters!
