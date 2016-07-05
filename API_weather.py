# -*- coding: utf-8 -*-
"""
Created on Fri Jun 17 10:11:00 2016

@author: Holly
"""
# import libraries
import datetime
import requests
import json
import sqlite3 as lite
import pandas as pd

# create cities dictionary to include cities of interest and their locations       
cities = {"Atlanta": '33.755960,-84.390304',
          "Austin": '30.265327,-97.743788',
          "Boston": '42.358056,-71.063611',
          "Denver": '39.761850,-104.881105',
          "Los Angeles": '34.050000,-118.250000',
          "San Francisco": '37.783333,-122.416667',
          "Seattle": '47.609722,-122.333056'
          }

APIKEY = "2afe41b558da0181d1a9483c41f42df8"

# start date is 30 days before now
start_date = datetime.datetime.now() - datetime.timedelta(days=30)

# create a connection object, con, which is the connection to the SQLite database "weather.db" (If weather.db does not exist, SQLite3 will create it.)
con = lite.connect('weather.db')
with con:
    # cur is the cursor object which is obtained from calling the .cursor method on the connection object, con
    cur = con.cursor()
    # create the temperature and summary table, dropping old versions (which might be corrupt) if they exist
    cur.execute("DROP TABLE IF EXISTS temperature")
    cur.execute("CREATE TABLE temperature (city text, tmax float, tmax_time integer)")

# initialize the date variable
date = start_date

# get forcast for all the cities
for city_var, latLong in cities.iteritems():
    # for each city, loop through past 30 days to get the weather data for that day and store in dataframe
    # Within the loop, convert start_date to proper format for URL.
    # I chose to use the [YYYY]-[MM]-[DD]T[HH]:[MM]:[SS] format which uses local time at each location as opposed to a UNIX time (seconds since midnight GMT on 1 Jan 1970) since to compare climatic data (like temperature swings) in the various cities which are in different time zones, local time is needed to ensure the same windows of temperature ranges.  For example the warmest hours of the day are typically 2-5 pm local time, so in order to compare apples to apples, the 2-5 pm range for Boston should be compared to the 2-5 pm range for San Francisco which is 3 hours behind Boston.  If UNIX time were used, when it is 2 pm in Boston, it is 11 am in San Francisco and likely cooler than it will be at 2 pm San Francisco time later that same day.  Though a monthly average will be calculated, the period over which the average is calculated should be comparable so the data should be in local time.
    for i in range(0, 30):  # beginning of date loop
        date_str = date.strftime('%Y') + '-' + date.strftime('%m') + '-' + date.strftime('%d') + 'T' + date.strftime('%H') + ':' + date.strftime('%M') + ':' + date.strftime('%S')

        url = 'https://api.forecast.io/forecast/' + APIKEY + '/' + latLong + ',' + date_str

        r = requests.get(url)  # issue the request
        # load the contents of r.text into a response dictionary using json.loads()
        response_dict = json.loads(r.text)

        # temperatureMax and time are part of the "daily" data block.  See API info: https://developer.forecast.io/docs/v2#time_call
        tmax_var = response_dict['daily']['data'][0]['temperatureMax']
        tmax_time_var = response_dict['daily']['data'][0]['temperatureMaxTime']

        # connect to weather database again to store data in the temperature table
        con = lite.connect('weather.db')
        with con:
            cur = con.cursor()
            #   insert data into the temperature table
            cur.execute("INSERT INTO temperature (city, tmax, tmax_time) VALUES (?, ?, ?)", (city_var, tmax_var, tmax_time_var))

            # select all rows
            cur.execute("SELECT * FROM temperature")

            # load into a pandas DataFrame for future calculations
            rows = cur.fetchall()  # store all rows of data in the "rows" variable
            cols = [desc[0] for desc in cur.description]  # get the column/field names from the cur.description attribute where the names of the columns are in the first position, the 0th spot.
            df = pd.DataFrame(rows, columns=cols)

        date = date + datetime.timedelta(days=1)
        # end of date loop - one city done, move on to the next city       
    #print('Just finished collecting and storing data for ' + city_var)  # print statement for debugging

    # end of city loop - all cities should have been processed

# calculate summary stistics over the 30-day period and store in a new dataframe, df_summary, then write to .csv file
df_summary = pd.DataFrame(columns=('city', 'long', 'lat', 'max_tmax', 'min_tmax', 'range_tmax', 'mean_tmax', 'sd_tmax'))

df_summary['max_tmax'] = df.groupby('city')['tmax'].max()
df_summary['min_tmax'] = df.groupby('city')['tmax'].min()
df_summary['mean_tmax'] = df.groupby('city')['tmax'].mean()
df_summary['sd_tmax'] = df.groupby('city')['tmax'].std()
df_summary['range_tmax'] = df_summary['max_tmax'] - df_summary['min_tmax']
df_summary['city'] = df_summary.index

for k, v in cities.iteritems():
    location = tuple(float(x) for x in v.split(','))
    df_summary.set_value(k,'lat',location[0])
    df_summary.set_value(k,'long',location[1])
    
df_summary.to_csv('summary.csv', index=False)
