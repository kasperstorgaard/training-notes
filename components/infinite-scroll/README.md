# Infinite scroll #
adapted from the approach of:
https://github.com/vaadin/vaadin-date-picker/blob/master/src/vaadin-infinite-scroller.html

## Concepts ##
Divide items into buffers, and swap them once each reaches the end, like this:

 +------------------+
 |    buffer 1      |
 |                  |
+|------------------|+
||                  ||
||                  ||
|+------------------+|
|+------------------+|
+|------------------|+
 |                  |
 |                  |
 |                  |
 |    buffer 2      |
 +------------------+   

## Ideas: ##
- Use intersection observer and possibly more buffers
- Provide optional function that fetches new data for items during a swap

## Questions: ##
- Can this be achieved with lit-html directive? (probably)

## Remember: ##
- Always use transform/translate
- Think about paint performance -> read all the things, then write all the things