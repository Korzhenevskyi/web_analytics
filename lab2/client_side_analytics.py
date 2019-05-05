__author__ = 'Oleksandr Korzhenevskyi'

import pandas as pd
import numpy as np
import math
from datetime import datetime, timedelta

def HourIndexToHour( hour_index ): # transforms hour index to the time format, i.e. 144 => '00:00:00'
    return hour_index.apply(lambda x: 'HH:HH:HH' if math.isnan(x) else str( int( x ) % 24 )+':00:00').apply(lambda x: '0'+x if len(x) < 8 else x)

def DateRangeToDate( hour_index, date_range ): #gets the date from the date_range
    date_range = [ datetime.strptime( x.split('-')[0].rstrip(), '%d.%m.%Y' ) + timedelta( days = ( 0 if math.isnan(y) else int(y) // 24 ) )
                   for x,y in zip(date_range, hour_index) ]
    return date_range

def ChangeDateTimeInfo( df ): #beautifies the dates and time
    df['Диапазон дат'] = DateRangeToDate( df['Индекс часа'], df['Диапазон дат'] )
    df['Индекс часа'] = HourIndexToHour( df['Индекс часа'] )
    return df.rename( index = str, columns = {'Диапазон дат' : 'Дата', 'Индекс часа' : 'Время' } )

def Normalize( column ):
    return column / column.max()

def FindAnomaly( target, sources, percent ):
    common_source = []
    for s in sources:
        common_source += s.tolist()
    bound = np.percentile( common_source, percent ) # find the upper bound for the area containing percent elements
    return target[ target['Просмотры страниц'] > bound ]

def WriteToFile( df, path ):
    file = open( path, 'w' )
    file.write( df.to_csv( index = False ) )
    file.close()

df = pd.read_csv( "Master_view_20190427-20190503.csv", index_col=False, header=5 )
df = ChangeDateTimeInfo( df )
mobile_devices = df[ df['Сегмент'] == 'Трафик с мобильных устройств' ][:-1]
tablet_pc = df[ df['Сегмент'] == 'Трафик с планшетных ПК' ][:-1]
new_users = df[ df['Сегмент'] == 'Новые пользователи' ][:-1]

mobile_devices['Просмотры страниц'] = Normalize(mobile_devices['Просмотры страниц'].astype(float))
tablet_pc['Просмотры страниц'] = Normalize(tablet_pc['Просмотры страниц'].astype(float))
new_users['Просмотры страниц'] = Normalize(new_users['Просмотры страниц'].astype(float))

percent = 90
mobile_devices_anomaly = FindAnomaly( mobile_devices, [ tablet_pc['Просмотры страниц'], new_users['Просмотры страниц'] ], percent )
tablet_pc_anomaly = FindAnomaly( tablet_pc, [ mobile_devices['Просмотры страниц'], new_users['Просмотры страниц'] ], percent )
new_users_anomaly = FindAnomaly( new_users, [ mobile_devices['Просмотры страниц'], tablet_pc['Просмотры страниц'] ], percent )

WriteToFile( mobile_devices_anomaly, 'mobile_devices_anomaly.csv')
WriteToFile( tablet_pc_anomaly, 'tablet_pc_anomaly.csv')
WriteToFile( new_users_anomaly, 'new_users_anomaly.csv')
