# Use Case: Internal Customer & Order Dashboard

## Overview

An internal web dashboard that gives support and operations teams a unified view of registered customers (with contact details) and their associated orders. Staff can quickly look up users and track order statuses without needing direct database access.

---

## Actors

- **Support Agent** — looks up customer contact details to assist with inquiries
- **Operations Staff** — monitors order statuses to manage fulfilment workflow

---

## Use Cases

### UC-1: View All Customers

**Actor:** Support Agent
**Trigger:** Agent opens the dashboard to assist an inbound inquiry
**Flow:**
1. Agent navigates to the dashboard
2. Frontend calls `GET /api/v1/users`
3. Dashboard renders a list of customers, each showing:
   - Avatar initial
   - Full name
   - Email address
   - Phone number
4. Agent identifies the customer by name and notes their contact details

**Outcome:** Agent has the customer's email and phone number to follow up

---

### UC-2: Look Up a Specific Customer by ID

**Actor:** Support Agent
**Trigger:** Agent receives a customer ID from a ticket or external system
**Flow:**
1. Agent (or an integrated tool) calls `GET /api/v1/users/:id` with the customer's ID
2. Backend validates the ID is a positive integer; returns `400` if not
3. Backend returns the customer record, or `404` if no match
4. Agent views the customer's name, email, and phone

**Outcome:** Agent retrieves the exact customer record; invalid IDs are safely rejected

---

### UC-3: Monitor Order Status

**Actor:** Operations Staff
**Trigger:** Staff opens the dashboard at the start of a shift to review pending work
**Flow:**
1. Staff navigates to the dashboard
2. Frontend calls `GET /api/v1/orders`
3. Dashboard renders an order table showing:
   - Order ID
   - Total amount
   - Status badge (color-coded: Processing / Shipped / Delivered)
4. Staff identifies orders still in **Processing** state that need action

**Outcome:** Staff has a clear, at-a-glance view of order pipeline and can prioritise work

---

## System Boundaries

| Component | Responsibility |
|---|---|
| React frontend | Renders the dashboard UI; proxies API calls to the backend |
| Express backend | Serves user and order data; validates inputs; returns structured JSON |
| In-memory data store | Holds mock users (with phone) and orders; no persistence layer |

---

## Constraints & Assumptions

- Data is currently in-memory (mock). In production this would be replaced with a database.
- The dashboard is intended for internal use only — no authentication is implemented.
- Phone numbers are optional; the UI omits the field gracefully if absent.
- The `GET /api/v1/users/:id` endpoint enforces that IDs must be positive integers, preventing lookup errors from malformed input.
