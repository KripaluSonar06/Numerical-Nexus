from flask import Flask, request, jsonify
from flask_cors import CORS
# import your_solution_modules  # Your actual solution code

app = Flask(__name__)
CORS(app)

# Assignment 2 - Q1.A endpoint
@app.route('/api/assignment2/q1a', methods=['POST'])
def harshad_q1a():
    data = request.json
    start_num = int(data['startNum'])
    # Call your actual function
    #result, terminal_output = your_solution_modules.find_first_non_harshad_factorial(start_num)
    return jsonify({
        'terminal_output': terminal_output,
        'answer': result
    })

# Assignment 2 - Q2 endpoint (all subquestions)
@app.route('/api/assignment2/q2', methods=['POST'])
def legendre_q2():
    data = request.json
    n = int(data['n'])
    # Generate all outputs
    #results = your_solution_modules.modified_legendre_all(n)
    return jsonify({
        'csv_a': results['coefficients'],  # List of lists
        'csv_b': results['companion_matrix'],
        'csv_c': results['roots'],
        'csv_d': results['solution'],
        'output_e': results['newton_raphson_text']
    })

# Assignment 3 - Q1 endpoint
@app.route('/api/assignment3/q1', methods=['POST'])
def gauss_legendre_q1():
    data = request.json
    n = int(data['n'])
    m = int(data['m'])
    #results = your_solution_modules.gauss_legendre_roots_weights(n, m)
    return jsonify({
        'csv_roots_weights': results['roots_weights'],
        'csv_a_matrix': results['a_matrix'],
        'csv_b_matrix': results['b_matrix'],
        'plot_image': results['plot_base64']  # Send plot as base64
    })

# Assignment 3 - Q2 endpoint
@app.route('/api/assignment3/q2', methods=['POST'])
def ode_solver_q2():
    data = request.json
    n = int(data['n'])
    #result = your_solution_modules.solve_ode_gauss_legendre(n)
    return jsonify({
        'output': result['comparison_text'],
        'plot_image': result['plot_base64']
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
