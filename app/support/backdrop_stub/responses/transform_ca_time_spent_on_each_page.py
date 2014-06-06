'''
Calculate the exit rate.

GA does give us an exitRate statistic, but it doesn't work well when
aggregated across sections. 

For sections, we need to look at the total number of exits anywhere in 
that section, over the total number of users in that section. (I think...
Need to get this peer reviewed. It might be over the total number of
page views.)

Anyway, this is a little script to calculate that and add it to the
stub data. 

If we decide to deploy this, we may need to add this calculation
to the GA collector for this statistic. 

'''

import json
from pprint import pprint

with open('carers-allowance-time-spent-on-each-page.json') as f:
    data = json.load(f)
    for d in data['data']:
        d['exitsOverUsers'] = (float(d['exits']) / float(d['users']))

with open('carers-allowance-time-spent-on-each-page.json', 'wb') as outfile:
    json.dump(data, outfile, sort_keys=True, indent=2)
