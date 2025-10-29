import random
from flask import Flask, render_template, jsonify

app = Flask(__name__)

def generar_datos_simulados(estado="reposo"):
    """
    Genera datos simulados para acelerómetro y giroscopio
    basados en el estado.
    """
    num_puntos = 100
    labels = list(range(1, num_puntos + 1))
    
    if estado == "reposo":
        base_accel = [0, 0, 9.8] 
        base_gyro = [0, 0, 0]
        ruido = 0.01
    elif estado == "normal":
        base_accel = [0.5, 0.5, 9.8]
        base_gyro = [0.2, 0.2, 0.2]
        ruido = 1.5
    else:
        base_accel = [1, 1, 9.8]
        base_gyro = [1, 1, 1]
        ruido = 5.0 

    def generar_serie(base, r):
        return [base + random.uniform(-r, r) for _ in labels]

    datos = {
        "labels": labels,
        "accelerometer": {
            "x": generar_serie(base_accel[0], ruido),
            "y": generar_serie(base_accel[1], ruido),
            "z": generar_serie(base_accel[2], ruido * 0.5), 
        },
        "gyroscope": {
            "x": generar_serie(base_gyro[0], ruido),
            "y": generar_serie(base_gyro[1], ruido),
            "z": generar_serie(base_gyro[2], ruido),
        }
    }
    return datos


@app.route('/')
def index():
    """ Sirve la página principal (index.html) """
    return render_template('index.html')

@app.route('/api/data/<string:estado>')
def get_data(estado):
    """ 
    API para obtener los datos.
    Responde con JSON simulado según el estado.
    """
    if estado not in ["reposo", "normal", "falla"]:
        return jsonify({"error": "Estado no válido"}), 400
        
    datos_simulados = generar_datos_simulados(estado)
    return jsonify(datos_simulados)


if __name__ == '__main__':
    app.run(debug=True)