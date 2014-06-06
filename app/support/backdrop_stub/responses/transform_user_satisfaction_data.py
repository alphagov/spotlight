'''
Script for transforming user satisfaction data.

Our current user satisfaction data in Backdrop can't easily
be displayed as a grouped timeseries graph, due to the data
format.

This is a little script to transform it into the right
structure for the grouped timeseries graph, purely for demo
purposes.

'''

import json
from pprint import pprint

keys = [u'rating_1:sum', u'rating_2:sum', u'rating_3:sum', u'rating_4:sum',
        u'rating_5:sum']

value_holder = {}
value_array = []
for k in keys:
    value_holder[k] = []

output = {'data': []}
for k in value_holder.keys():
    obj = {}
    obj['key'] = k
    obj['values'] = value_holder[k]
    output['data'].append(obj)

with open('carers-allowance-user-satisfaction-test.json', 'wb') as outfile:
    json.dump(output, outfile, sort_keys=True, indent=2)


# This was an attempt to transform the data and then feed it into
# Backdrop directly, but I decided not to go down that road
# in the end.
# with open('carers-allowance-user-satisfaction.json') as f:
#     data = json.load(f)
#     for d in data['data']:
#         for k in keys:
#             obj = {}
#             obj['rating'] = k
#             obj['count'] = d[k]
#             obj['_timestamp'] = d['_start_at']
#             value_holder[k].append(obj)
#             value_array.append(obj)

# pprint(value_array)

# with open('carers-allowance-user-satisfaction-test.json', 'wb') as outfile:
#     json.dump(value_array, outfile, sort_keys=True, indent=2)
