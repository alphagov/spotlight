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

###Currency

Accepts the options (symbol: defaults to '£', pence, dps)

```
{ sigfigs: 3, magnitude: true, type: 'currency' }
```

###Percent

Accepts the options (dps, normalisation, showSigns)

```
{ type: 'percent' }
```

###Integer

Calls number after it does a Math.round on the value.

```
{ type: 'integer' }
```

###Number

Accepts the options (commans: [true, false], sigfigs, fixed, dps)

```
{ sigfigs: 3, magnitude: true, type: 'number' }
```

###Date

Accepts the options (format: 'D MMMM YYYY')

```
{ type: 'date' }
```

###Time

Accepts the options (format: 'h:mma')

```
{ type: 'time' }
```

