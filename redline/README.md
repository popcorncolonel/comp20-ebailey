**Identify what aspects of the work have been correctly implemented and what have not.**  
Everything has been implemented to the best of my knowledge.

**Identify anyone with whom you have collaborated or discussed the assignment.**  
I discussed this assignment with Mathurshan Vimalesvaran and Colin Hamilton.

**Say approximately how many hours you have spent completing the assignment.**  
2

**For this lab, you must also answer the question: is it possible to request the real-time data from MBTA using XMLHttpRequest? Why or why not?.**  
It is also not possible since the same origin policy is set to www.mbta.com rather than \*. (AKA the response header from the server has the key-value pair {'Access-Control-Allow-Origin':'http://www.mbta.com'} which implies that only scripts from http://mbta.com are able to access the data.)
Also, this is not possible to do in "real-time", since, XMLHttpRequest is a static, one-time request, and the json file on the page is only updated on their server; that is, when it changes, you need to query it again after a certain point to get your data to update.

