# Overview

This is a freelance marketplace platform that connects clients with freelancers. The system enables clients to browse freelancer profiles, view portfolios, book services through pricing packages, and leave reviews. Freelancers can create profiles showcasing their skills and experience, publish pricing packages, display project portfolios, manage bookings, and receive notifications about client interactions.

The application uses a Node.js/Express backend with MongoDB for data persistence and a React frontend with Vite for the client-side interface.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React 19 with Vite 7 as the build tool and development server.

**Routing**: React Router DOM v7 for client-side navigation with path-based routing patterns.

**State Management**: Component-level state using React hooks. User authentication state persisted in localStorage.

**API Communication**: Axios-based HTTP client with interceptors for:
- Automatic JWT token attachment to requests
- Global 401 unauthorized handling with automatic redirect to login
- Dynamic API URL resolution for development vs production environments

**Styling Strategy**: CSS modules with custom properties for theming. Design system uses a blue color palette with comprehensive design tokens for colors, shadows, radius, and transitions.

**Path Aliases**: Configured in Vite for clean imports:
- `@` → src root
- `@components` → React components
- `@pages` → Page components
- `@services` → API service layer
- `@utils` → Utility functions
- `@contexts` → React contexts

## Backend Architecture

**Framework**: Express.js 5 running on Node.js with ES modules.

**API Design**: RESTful API structure with versioned routes under `/api` prefix. Route organization follows resource-based patterns (auth, freelancer, booking, pricing, reviews, notifications).

**Authentication**: JWT-based stateless authentication:
- Tokens issued on successful login containing userId
- Protected routes use authMiddleware to verify tokens and attach user object to requests
- Role-based access control (client vs freelancer) enforced at controller level

**Database**: MongoDB with Mongoose ODM for schema definition and data modeling.

**Data Models**:
- **User**: Core identity (email, password hash, role, profile info)
- **FreelancerProfile**: Extended profile for freelancers (specialization, skills, experience)
- **PricingPackage**: Service offerings with price and delivery time
- **ProjectShowcase**: Portfolio items with images and tags
- **Booking**: Job requests with status workflow (requested → accepted → in-progress → submitted → completed → paid)
- **Review**: Client feedback on completed bookings (1-5 rating scale)
- **Notification**: Real-time alerts for booking events

**Security Measures**:
- Password hashing with bcryptjs (10 salt rounds)
- JWT secrets from environment variables
- Password fields excluded from query results by default (Mongoose select: false)
- CORS enabled for cross-origin requests

**Middleware Stack**:
- body-parser for JSON and URL-encoded request parsing
- CORS for cross-origin resource sharing
- Custom authMiddleware for JWT verification and user attachment

## Data Storage

**Primary Database**: MongoDB accessed via Mongoose ORM.

**Connection Management**: 
- Single connection established at server startup
- Connection string stored in `MONGO_URL` environment variable
- Automatic process termination on connection failure

**Schema Design Patterns**:
- Reference-based relationships using ObjectId (e.g., freelancerId references User collection)
- Indexed fields for query optimization (email, userId, freelancerId, status)
- Unique constraints on business logic (one profile per freelancer, one review per booking)
- Timestamps automatically tracked on all models
- Validation at schema level (required fields, enums, string length limits)

**Data Consistency**: 
- One-to-one relationship between User and FreelancerProfile enforced by unique constraint
- Booking status uses predefined enum values
- Review-to-booking relationship is unique to prevent duplicate reviews

## External Dependencies

**Backend Dependencies**:
- **express**: Web framework for API routing and middleware
- **mongoose**: MongoDB object modeling and connection management
- **jsonwebtoken**: JWT creation and verification
- **bcryptjs**: Password hashing
- **dotenv**: Environment variable management
- **cors**: Cross-origin resource sharing
- **body-parser**: Request body parsing
- **nodemon**: Development server with hot reload

**Frontend Dependencies**:
- **react & react-dom**: UI library
- **react-router-dom**: Client-side routing
- **axios**: HTTP client for API requests
- **vite**: Build tool and development server
- **@vitejs/plugin-react**: Vite plugin for React support

**Development Tools**:
- **ESLint**: Code linting with React-specific rules
- **eslint-plugin-react-hooks**: React hooks linting
- **eslint-plugin-react-refresh**: Fast refresh validation

**Environment Configuration**:
- `MONGO_URL`: MongoDB connection string (required)
- `JWT_SECRET`: Secret key for JWT signing (required)
- `PORT`: Server port (defaults to 3000)

**Deployment Considerations**:
- Server binds to 0.0.0.0 for container compatibility
- Frontend proxy configured to route `/api` requests to backend
- HMR client port configured for production deployments (port 443)
- Static serving not configured (requires separate deployment of built frontend)