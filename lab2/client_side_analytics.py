__author__ = 'oleksandr korzhenevskyi'

import pandas as pd

def HourIndexToHour(hour_index):
    return str(int(hour_index) // 24)+':00:00'

def Normalize(column):
    return column/column.max()

df = pd.read_csv("Master_view_20190427-20190503.csv", index_col=False, header=5)
mobile_devices = df[ df['Сегмент'] == 'Трафик с мобильных устройств' ][:-1]
tablet_pc = df[ df['Сегмент'] == 'Трафик с планшетных ПК' ][:-1]
new_users = df[ df['Сегмент'] == 'Новые пользователи' ][:-1]

mobile_devices['Просмотры страниц'] = Normalize(mobile_devices['Просмотры страниц'].astype(float))
tablet_pc['Просмотры страниц'] = Normalize(tablet_pc['Просмотры страниц'].astype(float))
new_users['Просмотры страниц'] = Normalize(new_users['Просмотры страниц'].astype(float))

print(mobile_devices)