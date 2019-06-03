__author__ = 'Oleksandr Korzhenevskyi'
import pandas as pd
import numpy as np
import datetime

df = pd.read_csv('NYPD_Complaint_Data_Historic.csv', usecols=['CMPLNT_FR_DT'])
df['CMPLNT_FR_DT'] = pd.to_datetime(df['CMPLNT_FR_DT'], infer_datetime_format=True, errors='coerce')
df['CMPLNT_FR_DT'] = df.dropna()
startDate = datetime.datetime.strptime('2010-01-01', '%Y-%m-%d')
# endDate = '2012-12-31'
endDate = datetime.datetime.strptime('2012-12-31', '%Y-%m-%d')
# endDate = '12/13/2012'
startYear = '2010'
endYear = '2012'

df = df[(df['CMPLNT_FR_DT'] >= startDate) & (df['CMPLNT_FR_DT'] <= endDate)]
#

# print (df.to_string())
print(df)