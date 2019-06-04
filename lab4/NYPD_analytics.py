__author__ = 'Oleksandr Korzhenevskyi'
import pandas as pd
import numpy as np
import datetime
from pathlib import Path
from statsmodels.tsa.holtwinters import SimpleExpSmoothing
from statsmodels.tsa.ar_model import AR
from statsmodels.tsa.arima_model import ARMA

def WriteToFile( df, path ):
    file = open( path, 'w' )
    file.write( df.to_csv( index = False ) )
    file.close()

def GetGroupedData(startDate, endDate):
    df = pd.read_csv('NYPD_Complaint_Data_Historic.csv', usecols=['CMPLNT_FR_DT'])
    df['CMPLNT_FR_DT'] = pd.to_datetime(df['CMPLNT_FR_DT'], infer_datetime_format=True, errors='coerce')
    df['CMPLNT_FR_DT'] = df.dropna()
    df = df[(df['CMPLNT_FR_DT'] >= startDate) & (df['CMPLNT_FR_DT'] <= endDate)].groupby(['CMPLNT_FR_DT']).size().reset_index(name='Number')
    WriteToFile(df[:-10], 'without_last_10.csv')
    WriteToFile(df[-10:], 'last_10_ethalon.csv')

def SES(base_df, steps):
    data = base_df['Number'].tolist()
    model = SimpleExpSmoothing(data)
    model_fit = model.fit()
    yhat = model_fit.predict(len(data), len(data) + steps - 1)
    return np.round(yhat)

def AutoRegression(base_df, steps):
    data = base_df['Number'].tolist()
    model = AR(data)
    model_fit = model.fit()
    yhat = model_fit.predict(len(data), len(data) + steps - 1)
    return np.round(yhat)

def AutoRegressionMA(base_df, steps):
    data = base_df['Number'].tolist()
    model = ARMA(data, order=(2, 1))
    model_fit = model.fit(disp=False)
    yhat = model_fit.predict(len(data), len(data) + steps - 1)
    return np.round(yhat)


startDate = datetime.datetime.strptime('2010-01-01', '%Y-%m-%d')
endDate = datetime.datetime.strptime('2012-12-31', '%Y-%m-%d')


if not ( Path('without_last_10.csv').is_file() and Path('last_10_ethalon.csv').is_file() ):
    GetGroupedData(startDate, endDate)

base_df = pd.read_csv('without_last_10.csv')
ethalon_df = pd.read_csv('last_10_ethalon.csv')

steps = 10
ses_results = SES(base_df, steps)
ar_results = AutoRegression(base_df, steps)
arma_results = AutoRegressionMA(base_df, steps)

result_df = ethalon_df.rename( index = str, columns = {'Number' : 'Ethalon' } )
result_df['SES'] = ses_results
result_df['SES_delta'] = np.abs(result_df['Ethalon'] - result_df['SES'])
result_df['AR'] = ar_results
result_df['AR_delta'] = np.abs(result_df['Ethalon'] - result_df['AR'])
result_df['ARMA'] = arma_results
result_df['ARMA_delta'] = np.abs(result_df['Ethalon'] - result_df['ARMA'])
print (result_df.to_string())
WriteToFile(result_df, 'results.csv')
