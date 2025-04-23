# Earthquake Rescue Locator

An open-source disaster-response web application that crowdsources real-time reports of people trapped under rubble during earthquakes. The application provides a reliable, globally accessible map that rescue teams and volunteers can use to prioritize search efforts.

## Key Features

- Simple, mobile-friendly form for survivors or witnesses to submit locations
- Live map showing verified and unverified reports
- Serverless backend infrastructure to handle traffic spikes during disasters
- Data validation tools (CAPTCHA, volunteer moderation, timestamp filters)
- Offline functionality (PWA) for areas with poor connectivity
- GDPR-compliant (no personal data stored)

## Technical Stack

- Frontend: HTML, CSS, JavaScript (Vanilla JS)
- Map: Leaflet with OpenStreetMap
- Backend: Firebase (Firestore, Authentication, Functions)
- PWA capabilities for offline functionality

## Getting Started

1. Clone this repository
2. Run `npm install` to install dependencies
3. Set up Firebase project and update configuration
4. Run `npm start` to start the development server

## Contributing

This is an open-source project aimed at saving lives during disasters. Contributions are welcome! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines.

## License

MIT
