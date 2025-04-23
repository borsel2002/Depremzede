# Local Storage and Peer-to-Peer Architecture

This document explains the current architecture of the Earthquake Rescue Locator application, which uses local storage and peer-to-peer communication instead of external APIs.

## Local Storage Implementation

The application uses the browser's localStorage API to store and retrieve report data. This approach has several advantages:

1. **No external dependencies**: The application works without any external APIs or services
2. **Offline functionality**: Data is stored locally and available even without an internet connection
3. **Privacy**: User data remains on their device
4. **Simplicity**: No authentication or complex server setup required

### How Local Storage Works

1. When a user submits a report, the data is stored in localStorage with a unique ID
2. Reports are retrieved from localStorage when the application loads
3. Each report contains:
   - `id` - Unique identifier
   - `locationDescription` - Text description of the location
   - `numPeople` - Estimated number of people trapped
   - `situation` - Details about the situation
   - `contactInfo` - Optional contact information
   - `timestamp` - When the report was created
   - `status` - One of: "unverified", "verified", "resolved"
   - `latitude` - Geographic coordinate
   - `longitude` - Geographic coordinate
   - `nodeId` - Identifier of the node that created the report
   - `verificationVotes` - Array of node IDs that voted to verify
   - `resolutionVotes` - Array of node IDs that voted to resolve

## Peer-to-Peer Communication

The application uses the BroadcastChannel API to enable communication between different instances (nodes) of the application. This allows for a distributed deployment where multiple users can collaborate without a central server.

### How Peer-to-Peer Works

1. Each instance of the application generates a unique `nodeId` on startup
2. Instances communicate through a BroadcastChannel named 'earthquake-rescue-p2p'
3. When a new report is created, it's broadcast to all connected nodes
4. When a node receives a new report, it adds it to its local storage
5. When a node votes to verify or resolve a report, the vote is broadcast to all connected nodes
6. Reports are considered verified when they receive at least 3 verification votes
7. Reports are considered resolved when they receive at least 5 resolution votes

### Message Types

The peer-to-peer system uses the following message types:

1. `SYNC_REQUEST` - Request data from other nodes
2. `SYNC_DATA` - Send all reports to another node
3. `NEW_REPORT` - Broadcast a newly created report
4. `VERIFY_VOTE` - Cast a vote to verify a report
5. `RESOLVE_VOTE` - Cast a vote to resolve a report

## Community Verification System

To ensure the reliability of reports, the application implements a community verification system:

1. Reports start with the status "unverified"
2. Users can vote to verify a report
3. Each user (node) can only vote once per report
4. When a report receives 3 or more verification votes, it's marked as "verified"
5. Similarly, when a report receives 5 or more resolution votes, it's marked as "resolved"

## Setting Up for Development

1. No special setup is required beyond installing the npm dependencies
2. Run `npm install` to install dependencies
3. Run `npm start` to start the development server
4. Access the application at http://localhost:3000

## Testing the Peer-to-Peer Functionality

To test the peer-to-peer functionality:

1. Open the application in multiple browser windows or tabs
2. Create a report in one window
3. Verify that the report appears in all windows
4. Vote to verify the report in different windows
5. Verify that the votes are counted across all instances

## Limitations and Considerations

1. **Data persistence**: Data is stored only in the browser's localStorage, which means:
   - Data is lost if the user clears their browser data
   - Data doesn't sync between different devices of the same user
   - Data capacity is limited (usually 5-10MB)

2. **Peer-to-peer limitations**:
   - The BroadcastChannel API only works between tabs/windows of the same browser on the same device
   - In a real deployment, a more robust P2P solution like WebRTC would be needed

3. **Offline functionality**:
   - The application works offline, but peer-to-peer communication requires connectivity
   - Reports created offline will be shared when connectivity is restored

## Future Improvements

Potential improvements to the current architecture:

1. Implement IndexedDB for larger storage capacity
2. Add WebRTC for true peer-to-peer communication across different devices
3. Implement a more robust conflict resolution system
4. Add data compression to optimize storage
5. Implement end-to-end encryption for sensitive data
