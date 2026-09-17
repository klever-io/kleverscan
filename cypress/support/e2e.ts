// Loads for every spec. cypress-real-events adds cy.realPress and friends:
// real CDP input, so a Tab actually moves focus and an Enter actually
// activates a button, which cy.type() cannot do.
import 'cypress-real-events';
