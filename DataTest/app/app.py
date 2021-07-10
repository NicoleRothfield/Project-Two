from flask import Flask, render_template, jsonify, send_from_directory, request
import json
import pandas as pd
import numpy as np
import os
import sqlite3

#init app and class
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

#initiate memory cache of database
conn = sqlite3.connect('my_data.db')
query = "SELECT * FROM flightdata"
df = pd.read_sql(query, conn)
conn.close()

# Route to render index.html template
@app.route("/")
def home():
    # Return template and data
    return render_template("index.html")

@app.route("/getData", methods=["GET"])
def getData():
    #create aggregate 1
    airline_agg = df.groupby(["MKT_UNIQUE_CARRIER"]).size().reset_index()
    airline_agg.columns = ["Airline", "Count"]

    return(jsonify(json.loads(airline_agg.to_json(orient="records"))))

####################################
# ADD MORE ENDPOINTS
###########################################
#approute for bar chart

#app route for scatterplot

#############################################################
@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, public, max-age=0"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    return r

#main
if __name__ == "__main__":
    app.run(debug=True)