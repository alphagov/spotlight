#Formatting data in spotlight

Data in spotlight can be formatted in many different types. This document is intended to outline the main formatting options that can be used in a dashboard and where they are required to be configured.

##Graphs

Most of our graph modules support the `format` option key.

###Example

```
  {
   "format": {
    "sigfigs": 3,
    "magnitude": true,
    "type": "number"
   }
  }
```

##Tables

Data in tables is formatted using the `format` key specified in the axes.

###Example

```
  {
    "axes": {
      "y": [
       {
        "format": {"type": integer"},
        "groupId": "paper",
        "label": "Paper form"
       },
       {
        "format": {"type": integer"},
        "groupId": "digital",
        "label": "Digital"
       }
      ],
      "x": {
       "format": {"type": "date"},
       "key": [
        "_start_at",
        "_end_at"
       ],
       "label": "Date"
      }
     }
    }
  }
}
```

##Types of formatting:

The most common types of formatting are listed with examples below

###Duration

Accepts the options (unit: ['ms', 's', 'm'], pad: [true, false])

```
{ type: 'duration', unit: 'm' }
```

The default options for duration are:

```
{
  unit: 'ms',
  pad: true
}
```

###Currency

Accepts the options (symbol: defaults to '£', pence, dps). The magnitude option formats the value to the nearest significant scale. For example:
```
2990000000 > 2.9bn
1315000 > 1.3m
450000 > 450k
```
```
{ sigfigs: 3, magnitude: true, type: 'currency' }
```

The default options for currency are:

```
{
   symbol: '£',
   pence: (true for anything less than 10 or false for anything greater than 10)
}
```

###Percent

Accepts the options (dps [decimal places], normalisation, showSigns)

```
{ type: 'percent' }
```

The default options for percent are:

```
{
   dps: 1,
   normalisation: 1.0
}
```

###Integer

Calls number after it does a Math.round on the value.

```
{ type: 'integer' }
```

###Number

Accepts the options (commans: [true, false], sigfigs, fixed, dps). The magnitude option formats the value to the nearest significant scale. For example:
```
2990000000 > 2.9bn
1315000 > 1.3m
450000 > 450k
```

```
{ sigfigs: 3, magnitude: true, type: 'number' }
```

The default options for number are:

```
{
   commas: true,
   sigfigs: 3
}
```

###Date

Accepts the options (format: 'D MMMM YYYY')

```
{ type: 'date' }
```

The default options for date are:

```
{
   format: 'D MMMM YYYY'
}
```

###Time

Accepts the options (format: 'h:mma')

```
{ type: 'time' }
```

The default options for time are:

```
{
   format: 'h:mma'
}
```

