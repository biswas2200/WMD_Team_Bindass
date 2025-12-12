# Endpoint Testing Checkpoint

This document tracks the progress of testing all the backend API endpoints.

## Unauthenticated Endpoints
- [ ] `POST /auth/register`
- [ ] `GET /`
- [ ] `GET /health`
- [ ] `GET /ready`
- [ ] `GET /live`

## Authenticated Endpoints
- [ ] `POST /auth/login`
- [ ] `GET /profile`
- [ ] `POST /profile`
- [ ] `GET /users/profile`
- [ ] `PUT /users/profile`
- [ ] `GET /chat/history`
- [ ] `POST /chat/message`
- [ ] `GET /api/github/repos/{userId}`
- [ ] `POST /api/github/link`
- [ ] `GET /missions/{userId}`
- [ ] `GET /missions/{userId}/{missionId}`
- [ ] `POST /missions/{missionId}/start`
- [ ] `POST /missions/{missionId}/submit`
- [ ] `POST /api/kodra/assist`

## Webhook Endpoints
- [ ] `POST /api/webhooks/github`
- [ ] `POST /api/webhooks/coderabbit`
