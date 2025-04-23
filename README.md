# Earthquake Rescue Locator

An open-source disaster-response web application that crowdsources real-time reports of people trapped under rubble during earthquakes. The application provides a reliable, globally accessible map that rescue teams and volunteers can use to prioritize search efforts.

## Key Features

- Simple, mobile-friendly form for survivors or witnesses to submit locations
- Live map showing verified and unverified reports
- List view for easier browsing and searching of reports
- Community verification system requiring 3 votes to verify a report
- Community resolution system requiring 5 votes to mark a report as resolved
- Peer-to-peer communication for distributed deployment
- Offline functionality (PWA) for areas with poor connectivity
- No external API dependencies - fully self-contained application
- Multi-language support (Turkish, English, Arabic, Spanish)

## Technical Stack

- Frontend: HTML, CSS, JavaScript (Vanilla JS)
- Map: Leaflet with OpenStreetMap
- Local Storage: Browser localStorage API for data persistence
- Peer-to-Peer: BroadcastChannel API for distributed communication
- PWA capabilities for offline functionality
- Express.js for local development server

## Getting Started

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm start` to start the development server
4. Access the application at http://localhost:3000

## Contributing

This is an open-source project aimed at saving lives during disasters. Contributions are welcome! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines.

## License

MIT
