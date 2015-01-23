# Dicta

Dicta is a cross-platform business rules engine.

Dictionaries define [*dicta*](https://www.google.com/search?q=dictum) as a set of formal pronouncements from an authoritative source. The analyst, who owns the business case, writes a set of rules. Then the developer creates a user interface or a back-end application based on those rules.

Thus the analyst can create and maintain the business logic layer of the application separately from the data access, service and UI layers.

Unlike other business rule tools, Dicta does not require learning a new [*DSL*](https://www.google.com/search?q=domain-specific+language). The analyst writes the business logic in Javascript and leaves it to Dicta to track the dependencies, do lazy evaluation and notify the application of status changes.

Dicta itself is written in Javascript, therefore runs natively in any modern web browser. Dicta's .NET and Java APIs are based, respectively, on the [Node.js](http://nodejs.org/) and [Rhino](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/Rhino) Javascript engines.

Dicta also includes WPF and Apache Camel APIs for GUI and, respectively, back-end modelling, although this work is still in its exploratory stages.

Dicta is extremely lightweight (less than 1K lines of code).

Dicta is free open-source software under the business-friendly MIT license.
