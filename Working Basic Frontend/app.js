/**
 * =============================================
 * NUMERICAL METHODS ASSIGNMENT - 3D GUI
 * Interactive React-style application
 * =============================================
 * 
 * This application provides an immersive 3D interface
 * for displaying numerical methods assignment solutions.
 * 
 * STRUCTURE:
 * - Landing Page: Assignment selection
 * - Assignment Pages: Question cards
 * - Question Detail: Full view with tabs
 * - Solution Display: Terminal, CSV tables, graphs
 * - Thank You Page: Celebration finale
 * 
 * USER CUSTOMIZATION POINTS:
 * 1. Opening animation (line 850+): Add your GIF/video
 * 2. Team member names (line 100+): Update names and roll numbers
 * 3. Audio files (line 1200+): Add sound effects for thank you page
 * 4. PDF attachment (line 900+): Add Q2.pdf for Assignment 3 Q2
 * 5. Python backend integration: Replace mock data with real API calls
 * =============================================
 */

// =============================================
// APPLICATION STATE
// Manages all app data (no localStorage due to sandbox restrictions)
// =============================================
const AppState = {
  currentPage: 'landing', // 'landing', 'assignment2', 'assignment3', 'thankYou'
  currentQuestion: null, // 'q1', 'q2'
  currentAssignment: null, // 2 or 3
  showSolution: false,
  showCode: false,
  activeTab: 'question',
  activeSubTab: null,
  inputs: {},
  loading: false,
  questionProgress: {
    assignment2: { q1: false, q2: false },
    assignment3: { q1: false, q2: false }
  }
};

// =============================================
// DATA REPOSITORY
// Contains all questions, sample outputs, and code
// Replace with real backend API calls in production
// =============================================
const DATA = {
  team: {
    members: [
      { name: 'Malhar Kanhegaonkar', roll: 'ES24BTECH11018' },
      { name: 'Kripalu Sonar', roll: 'ES24BTECH11021' },
      { name: 'Taleem Hossain', roll: 'ES24BTECH11036' }
    ]
  },
  
  assignment2: {
    title: 'Assignment 2',
    subtitle: '1. Harshad Numbers  2. Modified Legendre Polynomial',
    
    q1: {
      title: 'Q1: Harshad Numbers',
      subQuestions: [
        {
          id: 'a',
          text: 'Q1.A: Find the first factorial which is not a Harshad number. You have to take input of a number from where you have to start searching.',
          inputs: [{ name: 'start', label: 'Starting number', type: 'number', placeholder: '2' }]
        },
        {
          id: 'b',
          text: 'Q1.B: Find n consecutive Harshad numbers. You have to take input of n (count), k (start from), and m (search until).',
          inputs: [
            { name: 'n', label: 'n (count of consecutive numbers)', type: 'number', placeholder: '5' },
            { name: 'k', label: 'k (start from)', type: 'number', placeholder: '10' },
            { name: 'm', label: 'm (search until)', type: 'number', placeholder: '1000' }
          ]
        }
      ],
      terminalOutput: [
        'Initializing Harshad Number Calculator...',
        'Checking factorial 2! = 2 ...',
        '2 is a Harshad number (divisible by digit sum 2)',
        'Checking factorial 3! = 6 ...',
        '6 is a Harshad number (divisible by digit sum 6)',
        'Checking factorial 4! = 24 ...',
        '24 is NOT a Harshad number (not divisible by digit sum 6)',
        'Done!',
        '=== Computation Complete ==='
      ],
      answer: 'The first factorial which is not a Harshad number is: 4! = 24',
      code: `# Q1.A: Find first factorial that is NOT a Harshad number\ndef is_harshad(n):\n    """Check if n is a Harshad number"""\n    digit_sum = sum(int(d) for d in str(n))\n    return n % digit_sum == 0\n\ndef first_non_harshad_factorial(start):\n    """Find first factorial that is not Harshad"""\n    factorial = 1\n    for i in range(1, start + 1):\n        factorial *= i\n    \n    n = start\n    while True:\n        factorial *= n\n        print(f"Checking {n}! = {factorial} ...")\n        if not is_harshad(factorial):\n            return n, factorial\n        n += 1\n\n# Main execution\nstarting_num = int(input("Enter starting number: "))\nn, result = first_non_harshad_factorial(starting_num)\nprint(f"Answer: {n}! = {result}")`
    },
    
    q2: {
      title: 'Q2: Modified Legendre Polynomial',
      text: 'This question has 5 sub-parts. Enter the polynomial order n to compute all solutions.',
      subQuestions: [
        'Q2.A: Determine the modified Legendre polynomial of the nth order',
        'Q2.B: Determine the companion matrix of this polynomial',
        'Q2.C: Determine the roots of the polynomial by determining the eigenvalues of the companion matrix using LU decomposition',
        'Q2.D: Determine the solution of Ax=b, when b={1,2,...n} using LU decomposition',
        'Q2.E: Determine the smallest and the largest roots of the polynomial using the Newton Raphson method'
      ],
      inputs: [{ name: 'n', label: 'Polynomial order (n)', type: 'number', placeholder: '5' }],
      csvData: {
        a: {
          title: 'Part A: Modified Legendre Polynomial Coefficients',
          filename: 'a.csv',
          data: [
            ['Coefficient', 'Value'],
            ['a0', '1.0000'],
            ['a1', '-2.5000'],
            ['a2', '3.7500'],
            ['a3', '-1.8750'],
            ['a4', '0.6250']
          ]
        },
        b: {
          title: 'Part B: Companion Matrix',
          filename: 'b.csv',
          data: [
            ['', 'Col1', 'Col2', 'Col3', 'Col4'],
            ['Row1', '0.0000', '1.0000', '0.0000', '0.0000'],
            ['Row2', '0.0000', '0.0000', '1.0000', '0.0000'],
            ['Row3', '0.0000', '0.0000', '0.0000', '1.0000'],
            ['Row4', '-1.6000', '3.0000', '-6.0000', '5.8750']
          ]
        },
        c: {
          title: 'Part C: Polynomial Roots (via LU Decomposition)',
          filename: 'c.csv',
          data: [
            ['Root #', 'Value'],
            ['1', '-1.8472'],
            ['2', '-0.7654'],
            ['3', '0.7654'],
            ['4', '1.8472']
          ]
        },
        d: {
          title: 'Part D: Solution of Ax=b using LU Decomposition',
          filename: 'd.csv',
          data: [
            ['Variable', 'Value'],
            ['x1', '2.4560'],
            ['x2', '-1.2340'],
            ['x3', '3.7890'],
            ['x4', '0.5670']
          ]
        }
      },
      outputE: `Newton Raphson Method Results:\n\nSmallest root: -1.8472\n  Converged in 5 iterations\n  Final error: 1.23e-08\n\nLargest root: 1.8472\n  Converged in 4 iterations\n  Final error: 8.45e-09\n\nMethod successfully computed extreme roots!`,
      code: `# Q2: Modified Legendre Polynomial - Complete Solution\nimport numpy as np\nimport pandas as pd\n\ndef modified_legendre_poly(n):\n    """Compute modified Legendre polynomial coefficients"""\n    # Implementation of modified Legendre polynomial\n    coeffs = np.zeros(n + 1)\n    # ... coefficient computation logic\n    return coeffs\n\ndef companion_matrix(coeffs):\n    """Create companion matrix from polynomial coefficients"""\n    n = len(coeffs) - 1\n    C = np.zeros((n, n))\n    C[:-1, 1:] = np.eye(n-1)\n    C[-1, :] = -coeffs[:-1] / coeffs[-1]\n    return C\n\ndef lu_decomposition(A):\n    """LU decomposition of matrix A"""\n    n = len(A)\n    L = np.eye(n)\n    U = A.copy()\n    # ... LU decomposition logic\n    return L, U\n\n# Main execution\nn = int(input("Enter polynomial order n: "))\ncoeffs = modified_legendre_poly(n)\npd.DataFrame(coeffs).to_csv('a.csv')\n\nC = companion_matrix(coeffs)\npd.DataFrame(C).to_csv('b.csv')\n\nroots = np.linalg.eigvals(C)\npd.DataFrame(roots).to_csv('c.csv')\n\nprint("All CSV files generated successfully!")`
    }
  },
  
  assignment3: {
    title: 'Assignment 3',
    subtitle: '1. Gaussian Quadrature  2. Gauss-Legendre ODE Method',
    
    q1: {
      title: 'Q1: Gauss-Legendre Polynomial',
      text: 'Determine the roots and weights of the Gauss-Legendre Polynomial using the eigenvalues and the norms of the eigenvectors respectively, up to n. Plot the weights against the roots. Determine A & B matrices for orthogonal collocation for m.',
      inputs: [
        { name: 'n', label: 'Polynomial order (n)', type: 'number', placeholder: '5' },
        { name: 'm', label: 'Collocation points (m)', type: 'number', placeholder: '3' }
      ],
      csvData: {
        roots_weights: {
          title: 'Roots and Weights',
          filename: 'roots-weights.csv',
          data: [
            ['Root', 'Weight'],
            ['-0.9062', '0.2369'],
            ['-0.5385', '0.4786'],
            ['0.0000', '0.5689'],
            ['0.5385', '0.4786'],
            ['0.9062', '0.2369']
          ]
        },
        a_matrix: {
          title: 'A Matrix (Orthogonal Collocation)',
          filename: 'A_matrix.csv',
          data: [
            ['', 'Col1', 'Col2', 'Col3'],
            ['Row1', '1.5000', '-2.0000', '0.5000'],
            ['Row2', '0.5000', '1.0000', '-1.5000'],
            ['Row3', '-0.5000', '2.0000', '1.5000']
          ]
        },
        b_matrix: {
          title: 'B Matrix (Orthogonal Collocation)',
          filename: 'B_matrix.csv',
          data: [
            ['', 'Col1', 'Col2', 'Col3'],
            ['Row1', '0.7500', '0.2500', '0.0000'],
            ['Row2', '0.2500', '0.5000', '0.2500'],
            ['Row3', '0.0000', '0.2500', '0.7500']
          ]
        }
      },
      plotDescription: 'Graph: Weights vs Roots for Gauss-Legendre Polynomial (n=5)',
      code: `# Q1: Gauss-Legendre Polynomial - Roots, Weights, and Matrices\nimport numpy as np\nimport matplotlib.pyplot as plt\nimport pandas as pd\n\ndef gauss_legendre_roots_weights(n):\n    """Compute roots and weights using eigenvalue method"""\n    # Create companion matrix for Legendre polynomial\n    beta = np.arange(1, n) / np.sqrt(4 * np.arange(1, n)**2 - 1)\n    T = np.diag(beta, 1) + np.diag(beta, -1)\n    \n    # Eigenvalues are roots\n    eigenvals, eigenvecs = np.linalg.eigh(T)\n    \n    # Weights from eigenvector norms\n    weights = 2 * eigenvecs[0, :]**2\n    \n    return eigenvals, weights\n\n# Main execution\nn = int(input("Enter n: "))\nm = int(input("Enter m: "))\n\nroots, weights = gauss_legendre_roots_weights(n)\n\n# Save and plot\ndf = pd.DataFrame({'Root': roots, 'Weight': weights})\ndf.to_csv('roots-weights.csv', index=False)\n\nplt.figure(figsize=(10, 6))\nplt.scatter(roots, weights, s=100, c='blue')\nplt.xlabel('Roots')\nplt.ylabel('Weights')\nplt.title('Gauss-Legendre Weights vs Roots')\nplt.grid(True)\nplt.savefig('roots-weights.png')\n\nprint("Files generated: roots-weights.csv, roots-weights.png")`
    },
    
    q2: {
      title: 'Q2: Gauss-Legendre ODE Method',
      text: 'Solve the ODE by Gauss-Legendre method with n in problem 1 and compare it with analytical solution.',
      hasFullQuestion: true,
      pdfPlaceholder: 'Q2.pdf - Full problem statement will be displayed here (User to attach PDF)',
      inputs: [{ name: 'n', label: 'Number of points (n)', type: 'number', placeholder: '5' }],
      output: `ODE Solution using Gauss-Legendre Method\n========================================\n\nProblem: dy/dx = f(x, y)\nMethod: Gauss-Legendre quadrature with n=5 points\n\nNumerical Solution Computed Successfully\n\nComparison with Analytical Solution:\n------------------------------------\nx=0.0: Numerical=0.0000, Analytical=0.0000, Error=0.0000\nx=0.2: Numerical=0.1987, Analytical=0.1987, Error=0.0001\nx=0.4: Numerical=0.3894, Analytical=0.3894, Error=0.0002\nx=0.6: Numerical=0.5646, Analytical=0.5646, Error=0.0001\nx=0.8: Numerical=0.7174, Analytical=0.7174, Error=0.0003\nx=1.0: Numerical=0.8415, Analytical=0.8415, Error=0.0001\n\nMaximum absolute error: 0.0003\nConvergence achieved in 12 iterations\n\nMethod demonstrates excellent agreement with analytical solution!`,
      code: `# Q2: Solve ODE using Gauss-Legendre Method\nimport numpy as np\nimport matplotlib.pyplot as plt\n\ndef gauss_legendre_ode_solver(f, y0, x_span, n):\n    """Solve ODE using Gauss-Legendre quadrature"""\n    roots, weights = gauss_legendre_roots_weights(n)\n    \n    # Transform to integration domain\n    x_points = np.linspace(x_span[0], x_span[1], 100)\n    y_numerical = np.zeros_like(x_points)\n    y_numerical[0] = y0\n    \n    # Gauss-Legendre integration\n    for i in range(1, len(x_points)):\n        h = x_points[i] - x_points[i-1]\n        # ... Gauss-Legendre quadrature implementation\n        y_numerical[i] = y_numerical[i-1] + h * np.sum(weights * f(x_points[i-1] + h*roots, y_numerical[i-1]))\n    \n    return x_points, y_numerical\n\n# Define ODE: dy/dx = f(x, y)\ndef f(x, y):\n    return x * np.cos(x)\n\n# Analytical solution\ndef analytical(x):\n    return np.sin(x)\n\n# Main execution\nn = int(input("Enter n: "))\nx, y_num = gauss_legendre_ode_solver(f, 0, [0, 1], n)\ny_ana = analytical(x)\n\nprint("Maximum error:", np.max(np.abs(y_num - y_ana)))`
    }
  }
};

// =============================================
// RENDERING FUNCTIONS
// Each function renders a specific page/component
// =============================================

/**
 * Render the main landing page
 * Shows assignment cards and team info
 */
function renderLandingPage() {
  const { team } = DATA;
  
  return `
    <div class="landing-page">
      <!-- Main heading with glow effect -->
      <h1 class="main-heading">Numerical Methods Assignment</h1>
      
      <!-- Assignment selection cards -->
      <div class="assignment-cards">
        <!-- Assignment 2 Card -->
        <div class="assignment-card" onclick="navigateToAssignment(2)">
          <h2>Assignment 2</h2>
          <p>1. Harshad Numbers<br>2. Modified Legendre Polynomial</p>
        </div>
        
        <!-- Assignment 3 Card -->
        <div class="assignment-card" onclick="navigateToAssignment(3)">
          <h2>Assignment 3</h2>
          <p>1. Gaussian Quadrature<br>2. Gauss-Legendre ODE Method</p>
        </div>
      </div>
      
      <!-- Team information -->
      <div class="team-info">
        <h3>Presented by:</h3>
        <div class="team-members">
          ${team.members.map((member, i) => `
            <div class="team-member">
              ${i + 1}. ${member.name} - ${member.roll}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

/**
 * Render an assignment page with question cards
 */
function renderAssignmentPage(assignmentNum) {
  const assignment = DATA[`assignment${assignmentNum}`];
  
  return `
    <div class="assignment-page">
      <!-- Back button -->
      <button class="back-button" onclick="navigateToLanding()">
        <i class="fas fa-arrow-left"></i> Back to Home
      </button>
      
      <!-- Assignment title -->
      <h1 class="assignment-title">${assignment.title}</h1>
      
      <!-- Question cards -->
      <div class="question-cards">
        <!-- Q1 Card -->
        <div class="question-card" onclick="openQuestion(${assignmentNum}, 'q1')">
          <h3>${assignment.q1.title}</h3>
          <p class="question-preview">
            ${assignment.q1.text || assignment.q1.subQuestions[0].text.substring(0, 100) + '...'}
          </p>
        </div>
        
        <!-- Q2 Card -->
        <div class="question-card" onclick="openQuestion(${assignmentNum}, 'q2')">
          <h3>${assignment.q2.title}</h3>
          <p class="question-preview">
            ${assignment.q2.text.substring(0, 100) + '...'}
          </p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render the full question detail view
 * This is the main interactive area with tabs
 */
function renderQuestionDetail(assignmentNum, questionId) {
  const question = DATA[`assignment${assignmentNum}`][questionId];
  const hasSubQuestions = question.subQuestions && Array.isArray(question.subQuestions) && question.subQuestions.length > 0 && question.subQuestions[0].id;
  
  return `
    <div class="question-detail">
      <!-- Close button -->
      <button class="close-detail" onclick="closeQuestion()">
        <i class="fas fa-times"></i>
      </button>
      
      <!-- Show Code button (appears when solution is shown) -->
      ${AppState.showSolution ? `
        <button class="show-code-button" onclick="toggleCode()">
          <i class="fas fa-code"></i>
          ${AppState.showCode ? 'Hide Code' : 'Show Code'}
        </button>
      ` : ''}
      
      <!-- Main question container -->
      <div class="question-container">
        <!-- Tab navigation -->
        <div class="tab-navigation">
          <button class="tab-button ${AppState.activeTab === 'question' ? 'active' : ''}" 
                  onclick="switchTab('question')">
            Question
          </button>
          ${AppState.showSolution ? `
            <button class="tab-button ${AppState.activeTab === 'solution' ? 'active' : ''}" 
                    onclick="switchTab('solution')">
              Solution
            </button>
          ` : ''}
        </div>
        
        <!-- Tab content area -->
        <div class="tab-content">
          ${AppState.showCode ? renderCodeViewer(assignmentNum, questionId) : 
            (AppState.activeTab === 'question' ? 
              renderQuestionTab(assignmentNum, questionId, question, hasSubQuestions) : 
              renderSolutionTab(assignmentNum, questionId, question, hasSubQuestions))}
        </div>
      </div>
    </div>
  `;
}

/**
 * Render the Question tab content
 * Shows question text and input fields
 */
function renderQuestionTab(assignmentNum, questionId, question, hasSubQuestions) {
  if (hasSubQuestions) {
    // For questions with sub-parts (like Assignment 2 Q1)
    return `
      <div class="question-content">
        <h2>${question.title}</h2>
        
        ${question.subQuestions.map((subQ, idx) => `
          <div class="sub-question-item">
            <strong>${subQ.text}</strong>
            <div style="margin-top: 15px;">
              ${subQ.inputs.map(input => `
                <div class="input-group">
                  <label class="input-label">${input.label}:</label>
                  <input type="${input.type}" 
                         class="input-field" 
                         id="input_${subQ.id}_${input.name}"
                         placeholder="${input.placeholder}"
                         onchange="saveInput('${subQ.id}_${input.name}', this.value)">
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
        
        <button class="get-solution-button" onclick="getSolution(${assignmentNum}, '${questionId}')">
          Get Solution
        </button>
      </div>
    `;
  } else if (question.subQuestions && question.csvData) {
    // For Q2 with CSV outputs
    return `
      <div class="question-content">
        <h2>${question.title}</h2>
        <p class="question-text">${question.text}</p>
        
        <div class="sub-questions">
          ${question.subQuestions.map((subQ, idx) => `
            <div class="sub-question-item">${subQ}</div>
          `).join('')}
        </div>
        
        <div style="margin-top: 30px;">
          ${question.inputs.map(input => `
            <div class="input-group">
              <label class="input-label">${input.label}:</label>
              <input type="${input.type}" 
                     class="input-field" 
                     id="input_${input.name}"
                     placeholder="${input.placeholder}"
                     onchange="saveInput('${input.name}', this.value)">
            </div>
          `).join('')}
        </div>
        
        <button class="get-solution-button" onclick="getSolution(${assignmentNum}, '${questionId}')">
          Get Solution
        </button>
      </div>
    `;
  } else {
    // For Assignment 3 questions
    return `
      <div class="question-content">
        <h2>${question.title}</h2>
        <p class="question-text">${question.text}</p>
        
        ${question.hasFullQuestion ? `
          <button class="view-question-button" onclick="showPDFModal()">
            <i class="fas fa-file-pdf"></i> View Full Question (PDF)
          </button>
        ` : ''}
        
        <div style="margin-top: 30px;">
          ${question.inputs.map(input => `
            <div class="input-group">
              <label class="input-label">${input.label}:</label>
              <input type="${input.type}" 
                     class="input-field" 
                     id="input_${input.name}"
                     placeholder="${input.placeholder}"
                     onchange="saveInput('${input.name}', this.value)">
            </div>
          `).join('')}
        </div>
        
        <button class="get-solution-button" onclick="getSolution(${assignmentNum}, '${questionId}')">
          Get Solution
        </button>
      </div>
    `;
  }
}

/**
 * Render the Solution tab content
 * Shows terminal output, CSV tables, or text results
 */
function renderSolutionTab(assignmentNum, questionId, question, hasSubQuestions) {
  // Assignment 2 Q1 - Terminal output with answer
  if (assignmentNum === 2 && questionId === 'q1') {
    return `
      <div class="solution-content">
        <h3>Terminal Output:</h3>
        <div class="terminal-output">
          ${question.terminalOutput.map((line, idx) => `
            <div class="terminal-line" style="animation-delay: ${idx * 0.1}s">${line}</div>
          `).join('')}
        </div>
        
        <div class="answer-display">
          <h3><i class="fas fa-check-circle"></i> Final Answer</h3>
          <p>${question.answer}</p>
        </div>
      </div>
    `;
  }
  
  // Assignment 2 Q2 - CSV tables with sub-tabs
  if (assignmentNum === 2 && questionId === 'q2') {
    const subTabs = ['a', 'b', 'c', 'd', 'e'];
    const activeSubTab = AppState.activeSubTab || 'a';
    
    return `
      <div class="solution-content">
        <h3>Solution Components:</h3>
        
        <!-- Sub-tabs for each part -->
        <div class="sub-tabs">
          ${subTabs.map(tab => `
            <button class="sub-tab-button ${activeSubTab === tab ? 'active' : ''}" 
                    onclick="switchSubTab('${tab}')">
              Part ${tab.toUpperCase()}
            </button>
          `).join('')}
        </div>
        
        <!-- Sub-tab content -->
        <div class="sub-tab-content">
          ${activeSubTab === 'e' ? 
            renderTextOutput(question.outputE) : 
            renderCSVTable(question.csvData[activeSubTab])}
        </div>
      </div>
    `;
  }
  
  // Assignment 3 Q1 - CSV tables and plot
  if (assignmentNum === 3 && questionId === 'q1') {
    const subTabs = ['roots_weights', 'a_matrix', 'b_matrix', 'plot'];
    const activeSubTab = AppState.activeSubTab || 'roots_weights';
    
    return `
      <div class="solution-content">
        <h3>Solution Components:</h3>
        
        <!-- Sub-tabs -->
        <div class="sub-tabs">
          <button class="sub-tab-button ${activeSubTab === 'roots_weights' ? 'active' : ''}" 
                  onclick="switchSubTab('roots_weights')">
            Roots & Weights
          </button>
          <button class="sub-tab-button ${activeSubTab === 'a_matrix' ? 'active' : ''}" 
                  onclick="switchSubTab('a_matrix')">
            A Matrix
          </button>
          <button class="sub-tab-button ${activeSubTab === 'b_matrix' ? 'active' : ''}" 
                  onclick="switchSubTab('b_matrix')">
            B Matrix
          </button>
          <button class="sub-tab-button ${activeSubTab === 'plot' ? 'active' : ''}" 
                  onclick="switchSubTab('plot')">
            Plot
          </button>
        </div>
        
        <!-- Sub-tab content -->
        <div class="sub-tab-content">
          ${activeSubTab === 'plot' ? 
            renderPlotPlaceholder(question.plotDescription) : 
            renderCSVTable(question.csvData[activeSubTab])}
        </div>
      </div>
    `;
  }
  
  // Assignment 3 Q2 - Text output
  if (assignmentNum === 3 && questionId === 'q2') {
    return `
      <div class="solution-content">
        <h3>ODE Solution Results:</h3>
        ${renderTextOutput(question.output)}
      </div>
    `;
  }
  
  return '<p>Solution content will appear here.</p>';
}

/**
 * Render CSV data as a beautiful table
 */
function renderCSVTable(csvInfo) {
  if (!csvInfo) return '<p>No data available</p>';
  
  const { title, filename, data } = csvInfo;
  const headers = data[0];
  const rows = data.slice(1);
  
  return `
    <div class="csv-section">
      <h4>${title}</h4>
      
      <div class="csv-table-container">
        <table class="csv-table">
          <thead>
            <tr>
              ${headers.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => `
              <tr>
                ${row.map(cell => `<td>${cell}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <button class="download-csv-button" onclick="downloadCSV('${filename}', ${JSON.stringify(data).replace(/"/g, '&quot;')})">
        <i class="fas fa-download"></i> Download ${filename}
      </button>
    </div>
  `;
}

/**
 * Render text output in a styled box
 */
function renderTextOutput(text) {
  return `
    <div class="answer-display">
      <pre style="white-space: pre-wrap; font-family: 'Courier New', monospace; line-height: 1.8;">${text}</pre>
    </div>
  `;
}

/**
 * Render plot placeholder
 * User will replace with actual generated plot
 */
function renderPlotPlaceholder(description) {
  return `
    <div class="plot-container">
      <h4>Graph Visualization</h4>
      <div class="plot-placeholder">
        <i class="fas fa-chart-line" style="font-size: 3rem; margin-bottom: 20px; display: block;"></i>
        <p>${description}</p>
        <p style="margin-top: 10px; color: var(--accent-cyan);">
          📊 Plot will be generated from Python backend: roots-weights.png
        </p>
      </div>
      <button class="download-csv-button" style="margin-top: 20px;">
        <i class="fas fa-download"></i> Download Plot (PNG)
      </button>
    </div>
  `;
}

/**
 * Render code viewer overlay
 */
function renderCodeViewer(assignmentNum, questionId) {
  const question = DATA[`assignment${assignmentNum}`][questionId];
  const code = question.code;
  
  return `
    <div class="code-viewer">
      <div class="code-viewer-header">
        <h3><i class="fas fa-code"></i> Python Solution Code</h3>
      </div>
      
      <div class="code-content">
        <pre>${escapeHTML(code)}</pre>
      </div>
    </div>
  `;
}

/**
 * Render Thank You page
 * Final celebration screen
 */
function renderThankYouPage() {
  return `
    <div class="thank-you-page">
      <div class="thank-you-content">
        <div class="celebration-animation">
          🎉 🎊 ✨ 🌟 💫
        </div>
        
        <h1 class="thank-you-title">Thank You!</h1>
        
        <p class="thank-you-message">
          We hope you enjoyed exploring our Numerical Methods solutions.<br>
          This interactive 3D GUI was designed to make mathematics beautiful and accessible.<br><br>
          <strong>"Mathematics is not about numbers, equations, or algorithms.<br>
          It is about understanding."</strong>
        </p>
        
        <button class="home-button" onclick="navigateToLanding()">
          <i class="fas fa-home"></i> Return to Home
        </button>
      </div>
    </div>
  `;
}

/**
 * Render loading overlay
 */
function renderLoading(message = 'Processing...') {
  return `
    <div class="loading-overlay">
      <div class="spinner"></div>
      <div class="loading-text">${message}</div>
    </div>
  `;
}

/**
 * Render PDF modal for Assignment 3 Q2
 */
function renderPDFModal() {
  const question = DATA.assignment3.q2;
  
  return `
    <div class="modal-overlay" onclick="closePDFModal()">
      <div class="modal-content" onclick="event.stopPropagation()">
        <button class="modal-close" onclick="closePDFModal()">
          <i class="fas fa-times"></i>
        </button>
        
        <h2 style="color: var(--accent-cyan); margin-bottom: 20px;">
          <i class="fas fa-file-pdf"></i> Full Question Statement
        </h2>
        
        <div style="padding: 40px; background: rgba(255, 255, 255, 0.05); border-radius: 10px; text-align: center;">
          <i class="fas fa-file-pdf" style="font-size: 4rem; color: var(--accent-purple); margin-bottom: 20px;"></i>
          <p style="font-size: 1.2rem; color: var(--text-secondary); line-height: 1.8;">
            ${question.pdfPlaceholder}
          </p>
          <p style="margin-top: 20px; color: var(--accent-cyan);">
            📎 User will attach Q2.pdf here for display
          </p>
        </div>
      </div>
    </div>
  `;
}

// =============================================
// NAVIGATION FUNCTIONS
// Handle page transitions and state changes
// =============================================

function navigateToLanding() {
  AppState.currentPage = 'landing';
  AppState.currentQuestion = null;
  AppState.currentAssignment = null;
  render();
}

function navigateToAssignment(assignmentNum) {
  AppState.currentPage = `assignment${assignmentNum}`;
  AppState.currentAssignment = assignmentNum;
  render();
}

function openQuestion(assignmentNum, questionId) {
  AppState.currentQuestion = questionId;
  AppState.currentAssignment = assignmentNum;
  AppState.showSolution = false;
  AppState.showCode = false;
  AppState.activeTab = 'question';
  AppState.activeSubTab = null;
  AppState.inputs = {};
  render();
}

function closeQuestion() {
  AppState.currentQuestion = null;
  render();
}

function switchTab(tab) {
  AppState.activeTab = tab;
  AppState.showCode = false;
  render();
}

function switchSubTab(subTab) {
  AppState.activeSubTab = subTab;
  render();
}

function toggleCode() {
  AppState.showCode = !AppState.showCode;
  render();
}

// =============================================
// ACTION FUNCTIONS
// Handle user interactions
// =============================================

function saveInput(name, value) {
  AppState.inputs[name] = value;
}

function getSolution(assignmentNum, questionId) {
  // Show loading animation
  showLoading('Computing solution...');
  
  // Simulate processing time (replace with actual backend call)
  setTimeout(() => {
    hideLoading();
    
    // Mark question as complete
    AppState.questionProgress[`assignment${assignmentNum}`][questionId] = true;
    
    // Switch to solution tab
    AppState.showSolution = true;
    AppState.activeTab = 'solution';
    AppState.activeSubTab = assignmentNum === 2 && questionId === 'q2' ? 'a' : 
                           (assignmentNum === 3 && questionId === 'q1' ? 'roots_weights' : null);
    
    render();
    
    // Check if all questions completed for thank you page
    checkAllQuestionsComplete();
  }, 2000);
}

function checkAllQuestionsComplete() {
  const progress = AppState.questionProgress;
  const allComplete = progress.assignment2.q1 && progress.assignment2.q2 && 
                     progress.assignment3.q1 && progress.assignment3.q2;
  
  if (allComplete && AppState.currentPage !== 'thankYou') {
    // Wait a bit then show thank you page option
    // User can manually navigate or we can auto-redirect
  }
}

function downloadCSV(filename, data) {
  // Convert data array to CSV string
  const csvContent = data.map(row => row.join(',')).join('\n');
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

function showPDFModal() {
  const modal = renderPDFModal();
  const div = document.createElement('div');
  div.id = 'pdf-modal';
  div.innerHTML = modal;
  document.body.appendChild(div);
}

function closePDFModal() {
  const modal = document.getElementById('pdf-modal');
  if (modal) {
    modal.remove();
  }
}

function showLoading(message) {
  AppState.loading = true;
  const loading = renderLoading(message);
  const div = document.createElement('div');
  div.id = 'loading-overlay';
  div.innerHTML = loading;
  document.body.appendChild(div);
}

function hideLoading() {
  AppState.loading = false;
  const loading = document.getElementById('loading-overlay');
  if (loading) {
    loading.remove();
  }
}

// =============================================
// MAIN RENDER FUNCTION
// Updates the entire UI based on current state
// =============================================

function render() {
  const mainContent = document.getElementById('main-content');
  
  let content = '';
  
  // Render based on current state
  if (AppState.currentQuestion) {
    // Question detail view
    content = renderQuestionDetail(AppState.currentAssignment, AppState.currentQuestion);
  } else if (AppState.currentPage === 'landing') {
    // Landing page
    content = renderLandingPage();
  } else if (AppState.currentPage === 'assignment2') {
    // Assignment 2 page
    content = renderAssignmentPage(2);
  } else if (AppState.currentPage === 'assignment3') {
    // Assignment 3 page
    content = renderAssignmentPage(3);
  } else if (AppState.currentPage === 'thankYou') {
    // Thank you page
    content = renderThankYouPage();
  }
  
  mainContent.innerHTML = content;
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// =============================================
// INITIALIZATION
// Start the application when DOM is ready
// =============================================

document.addEventListener('DOMContentLoaded', function() {
  // Initial render
  render();
  
  // USER CUSTOMIZATION: Add your opening animation here
  // Example: Add a video or GIF element to #animated-background
  // const bg = document.getElementById('animated-background');
  // bg.innerHTML = '<video autoplay loop muted><source src="math-animation.mp4" type="video/mp4"></video>';
  
  console.log('🎓 Numerical Methods Assignment GUI loaded!');
  console.log('📝 Created by: [Your Names Here]');
  console.log('✨ Enjoy exploring the solutions!');
});

// Make functions globally accessible for onclick handlers
window.navigateToLanding = navigateToLanding;
window.navigateToAssignment = navigateToAssignment;
window.openQuestion = openQuestion;
window.closeQuestion = closeQuestion;
window.switchTab = switchTab;
window.switchSubTab = switchSubTab;
window.toggleCode = toggleCode;
window.saveInput = saveInput;
window.getSolution = getSolution;
window.downloadCSV = downloadCSV;
window.showPDFModal = showPDFModal;
window.closePDFModal = closePDFModal;