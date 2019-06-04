__author__ = 'Oleksandr Korzhenevskyi'
import pandas as pd
import numpy as np
import datetime
from pathlib import Path

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

startDate = datetime.datetime.strptime('2010-01-01', '%Y-%m-%d')
endDate = datetime.datetime.strptime('2012-12-31', '%Y-%m-%d')


if not ( Path('without_last_10.csv').is_file() and Path('last_10_ethalon.csv').is_file() ):
    GetGroupedData(startDate, endDate)

base_df = pd.read_csv('without_last_10.csv')
ethalon_df = pd.read_csv('last_10_ethalon.csv')

print(ethalon_df)
