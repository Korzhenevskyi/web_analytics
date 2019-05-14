# Web-analytics. Laboratory work 2. Data analysis on the client side

### Analyzed data
- The data was obtained from the Google analytics test account.
- We have chosen 3 parameters. These are page views by: 
  - new users; 
  - users with mobile phones;
  - users with tablet PCs.
- The format of data is csv.
- The results are in range \[0, 1\].

### Used technologies
- Python 3.7.0
- Pandas 0.23.4
- Numpy 1.15.1

### The results
We decided to find as an anomaly a state of the parameter which exceeds 90% of values of the other two factors. Here are some conclusions:

- There is only 1 anomaly for tablet PCs because of the small amount of usage of such devices. It is difficult to analyze it. It was Friday evening, so maybe some user wanted to have a rest and to get some entertainment with his tablet after the hard working week.
- The largest amount of page views by users with mobile phones are on the working days. The time equals predominantly to the time when people get to work or home or have lunch.
- Such a large ammount of page views by new users could be caused by the holidays in the most countries, which were the parts of USSR. There were lots of photos and congratulations at that period. We should also pay attention that these anomalies are in comparison with users with mobile phones and tablet PCs. It means that the most views from new users were made with the help of laptops or PCs.
