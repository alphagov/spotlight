# Tracing a request through spotlight

If you hit a generic spotlight dashboard or module page, this is what happens.

<details>
<summary>What does "module" mean to spotlight?</summary>

<div>
In spotlight, the term "module" roughtly equates to a graph. It defines the type of graph, its associated metadata (title and description, etc), as well as the data associated with it.

- A "dashboard page" shows a bunch of graphs -- each of these is a module.

- A "module page" is a page with a graph and a table, which are just different representations of the same data.
</div>
</details>

##### [`app/appBuilder.js`][appbuilder]

After getting a request, you'll start off in [`appBuilder.js`][appbuilder], which lists all the routes. The explicitly named routes are quite straightforward ([`/performance/about`][appbuilder_about], etc), but they represent a minority of pages in the application.

Most of the application is either

- dashboard pages: pages with lots of graphs
- module pages: pages with one graph and a table

There’s [one route][appbuilder_*] that handles both of these, and it fobs you off to [`process_request.js`][process_request].

##### [`app/process_request.js`][process_request]

At a high level, [`process_request.js`][process_request] is doing two things.

1. It has a [`setup()`][process_request_setup] function, which builds and returns a stagecraft API client object from [`get_dashboard_and_render.js`][get_dashboard_and_render]
2. There’s a [`renderContent()`][process_request_renderContent] function which (because in JavaScript, functions are first-class citizens) gets passed further and further down potentially endless fractals of nested objects as a callback

The [setup][process_request_setup] function is called first.

##### `app/server/mixins/get_dashboard_and_render.js`

Mostly what this code is doing is creating the [stagecraft API client][stagecraft_api_client_2]. It passes in some data from the URL (needed to call the [Stagecraft][stagecraft] API) and sets up event listeners on the API client. Its most important function, [`get_dashboard_and_render()`][get_dashboard_and_render_2], takes [`renderContent()`][process_request_renderContent] (from the previous file) as a callback and runs it once the API client has been `sync`ed. ([`sync`][backbone_sync] is a Backbone convention -- more on this later).


##### [`app/stagecraft_api_client.js`][stagecraft_api_client]

The [`StagecraftApiClient`][stagecraft_api_client_2] is an object that makes the initial async call to the API (using [`fetch()`][stagecraft_api_client_fetch], another [Backbone convention][backbone_fetch]) and then parses the JSON response into objects the application is expecting. As part of this, [it assigns a controller to each module][stagecraft_api_client_controllers].

(So a `grouped_timeseries` module will be assigned a `GroupedTimeseriesModule` controller. Controllers (also confusingly called "modules") are defined in [`server/controller_map.js`][controller_map].)

##### [`app/process_request.js`][process_request]

Once the API client has been initialised, then [`setup()`][process_request_setup] is finished. At this point, we wait for [the API client][stagecraft_api_client_2] to trigger an event: either it will [`sync`][get_dashboard_and_render_sync] (likely) or it will [`error`][get_dashboard_and_render_error] (unlikely).

Backbone follows an event-driven paradigm: ie, instead of writing procedural code that executes sequentially until the end of the file, you react to _events_ in the DOM. So, for example, you could set up a "start" button and wait for a "click" event before starting anything.

Since Backbone is event-driven, there’s a point at which just following the code is misleading, because it will just stop somewhere and start again somewhere else. There are also several points in the code where events are triggered programmatically (ie, you can just call 'button.click()' to force an event.)

The general idea here is that spotlight sets up what it can set up with just the URL of the request, and then it waits for the `sync` event, triggered once a response has been successfully returned from the API, before doing any more.

There are two important `sync`s that need to happen.

1. First, get a JSON file which defines the modules on the page. (ie, a dashboard might have 6 modules: 3 big numbers at the top of the page, 2 line graphs, and 1 bar graph)
2. Secondly, for each module, the a separate call has to be made (not using the API client) to get the data for the graph

Once the [`.setup()`][process_request_setup] function is completed then we wait for the first of these: for the stagecraft API client to return a list of modules.


##### [`app/server/mixins/get_dashboard_and_render.js`][get_dashboard_and_render]

Once the data from the API is `sync`ed, it triggers [the event listener][get_dashboard_and_render_sync] in this file. This function then calls [`renderContent()`][get_dashboard_and_render_renderContent], which was defined in [`process_request.js`][process_request_renderContent].


##### [`app/process_request.js`][process_request]

In [`renderContent()`][process_request_renderContent], the `model` variable at this point is the API client which now has a bunch of config data about the page we're loading and a bunch of application defaults [set by `PageConfig`][process_request_PageConfig].

If you were looking to add a new generic parameter to the application, a good place to put it would be in the [`commonConfig` in `page_config.js`][page_config_commonConfig].

Our `model` also has a controller, which contains the logic for the particular page it's loading. This is [set by the stagecraft API client][stagecraft_api_client_controllers]. (For dashboard pages and module pages, this controller will always be the [`DashboardController`][controller_map_DashboardController])

Once we have the initial JSON response, we know

- what the main controller is (ie, a dashboard controller)
- what all of the submodules are (ie, each of the graphs) as well as each of _their_ controllers

A [`ready` event listener][process_request_ready] is set up on the controller, which doesn't do anything right now. This is the code that actually [sends the response back to the browser][process_request_ready_html], but at this point we haven't built the HTML yet.

Finally, near the bottom, there's a [`controller.render()`][process_request_controllerrender] call. This is pretty much what builds the page. `render()` is called for whichever controller was set by the API client.


##### [`app/extensions/mixins/performance.js`][performance]

This isn't functionally important, but should probably be mentioned. Spotlight has wrappers that start timers and then call your business logic as callback methods. `controller.render()` is being timed. If you’re debugging and you end up in a timer, look for the callback and keep going from there. (ie, [` cachedFn.apply(object, arguments);`][performance_apply])

##### [`app/server/controllers/dashboard.js`][server_dashboard]

[`render()`][server_dashboard_render] calls [`this.renderDashboard()`][server_dashboard_renderDashboard] and then passes the [`Controller.prototype.render`][server_dashboard_ControllerPrototypeRender] function through as a callback. This means the generic `render()` method attached to the Controller base class ([`app/extensions/controllers/controller.js`][extensions_controller]) will be called somewhere down the line.

##### [`app/extensions/controllers/dashboard.js`][extensions_dashboard]

[`renderDashboard()`][extensions_dashboard_renderDashboard] pretty much immediately just calls [`this.renderModules()`][extensions_dashboard_thisrenderModules]. The `callback` it passes through is the [`Controller.prototype.render()`][server_dashboard_ControllerPrototypeRender] function.

##### [`app/extensions/controllers/controller.js`][extensions_controller]

[`renderModules()`][extensions_controller_renderModules] sets the base controller (ie, the dashboard) to [listen for the `loaded` event][extensions_controller_loaded], which will kick off the render method of the highest-level controller. It then [it runs `map` over all the submodules][extensions_controller_map], adding [a `ready` event listener][extensions_controller_ready] to each of them, and then [calling `render()` on each of them][extensions_controller_modulerender] individually.

[`render()`][extensions_controller_render] is also a function in this file. Since all of the submodule controllers are also instances of this base Controller prototype, calling `render()` on them will run the function in this file.  `render()` sets up one-time event listeners for both [`reset`][extensions_controller_renderreset] and [`error`][extensions_controller_rendererror] events, and then it calls [`collection.fetch()`][extensions_controller_rendercollectionfetch]. In practice, we expect the `reset` to be triggered.

[`fetch()`][backbone_fetch] is a Backbone convention that connects to some external source to get some data. Calling `fetch()` should be possible on models or collections of models, after which some data will be returned and an event will be triggered. This is a pretty key to how Backbone works.

What is happening here is that each of the modules contains the _metadata_ for a graph (ie, its name and description and what kind of graph it is), but they still need to actually populate the graph with values. So calling [`collection.fetch()`][extensions_controller_rendercollectionfetch] should return all the actual data that we can then use to build the graph and the data table.

##### [`app/extensions/mixins/safesync.js`][safesync]

[`fetch()`][extensions_controller_rendercollectionfetch] eventually calls [`sync()`][safesync_sync] which is defined in this file. It escapes the returned values but otherwise it is just using the Backbone default logic. Interestingly, this `fetch()` doesn't use the stagecraft API client.

##### [`app/extensions/controllers/controller.js`][extensions_controller]

- Once the data that populates each of the graphs is returned successfully, a `reset` event is triggered
- Once the `reset` event is triggered, [then we call `renderView()`][extensions_controller_renderrenderView]
- [`renderView()`][extensions_controller_renderView]:
 - [creates a new `View` class][extensions_controller_renderViewnewView] based on the module
 - and then [calls `render()`][extensions_controller_renderViewviewrender] on this new View

##### [`app/extensions/views/view.js`][view]

And here's where we finally start building our HTML -- effectively a global variable we can keep referring to and populating.

The base (outermost) View will assign itself a template ([`this.$el.html(this.template(context));`][view_html]), which is a page that has lots of empty elements.

[for example][templates_module],

```
<div class=“visualisation-inner”></div>
<div class=“visualisation-table”></div>
```

Once this is set up, it calls [`this.renderSubviews()`][view_renderrenderSubviews].

[`renderSubviews()`][view_renderSubviews] cycles through the submodules contained by this root View and tries to build them. Each submodule has a classname or id as an identifier, so for each one, we will [look in the current HTML for the id or classname to latch onto][view_renderSubviews], and then [create a `new View(options)`][view_renderSubviewsnewView] which is [immediately rendered][view_renderSubviewsviewrender], effectively building the HTML that describes what they are inside their (initially empty) container element.

##### [`app/extensions/views/table.js`][table] (for example)

As an example, if our submodule is a graph, then calling the [`new View`][view_renderSubviewsnewView] in the base view file will create a new [`TableView`][table_TableView], and then [`view.render()`][view_renderSubviewsviewrender] will call the the [`render()`][table_render] method of the TableView.  This is probably what were were looking for in the first place.

Once we're here, we're finally in the guts of the page we're trying to build and we can start making changes to the output of the page.


[appbuilder]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/appBuilder.js
[appbuilder_about]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/appBuilder.js#L105
[appbuilder_*]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/appBuilder.js#L122

[process_request]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/process_request.js
[process_request_renderContent]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/process_request.js#L8
[process_request_PageConfig]: [https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/process_request.js#L10]
[process_request_setup]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/process_request.js#L39
[process_request_ready]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/process_request.js#L25
[process_request_ready_html]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/process_request.js#L31
[process_request_controllerrender]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/process_request.js#L34

[get_dashboard_and_render]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/server/mixins/get_dashboard_and_render.js
[get_dashboard_and_render_2]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/server/mixins/get_dashboard_and_render.js#L26
[get_dashboard_and_render_error]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/server/mixins/get_dashboard_and_render.js#L29
[get_dashboard_and_render_sync]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/server/mixins/get_dashboard_and_render.js#L35
[get_dashboard_and_render_renderContent]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/server/mixins/get_dashboard_and_render.js#L38

[stagecraft_api_client]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/stagecraft_api_client.js#L5
[stagecraft_api_client_2]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/stagecraft_api_client.js#L5
[stagecraft_api_client_fetch]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/stagecraft_api_client.js#L32
[stagecraft_api_client_controllers]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/stagecraft_api_client.js#L71-L77

[page_config_commonConfig]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/page_config.js#L7

[controller_map]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/server/controller_map.js
[controller_map_DashboardController]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/server/controller_map.js#L26

[performance]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/mixins/performance.js
[performance_apply]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/mixins/performance.js#L36

[server_dashboard]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/server/controllers/dashboard.js
[server_dashboard_render]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/server/controllers/dashboard.js#L36
[server_dashboard_renderDashboard]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/server/controllers/dashboard.js#L37
[server_dashboard_ControllerPrototypeRender]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/server/controllers/dashboard.js#L37

[extensions_dashboard]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/controllers/dashboard.js
[extensions_dashboard_renderDashboard]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/controllers/dashboard.js#L6
[extensions_dashboard_thisrenderModules]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/controllers/dashboard.js#L8

[extensions_controller]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/controllers/controller.js
[extensions_controller_renderModules]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/controllers/controller.js#L118
[extensions_controller_loaded]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/controllers/controller.js#L130-L131
[extensions_controller_map]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/controllers/controller.js#L135
[extensions_controller_ready]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/controllers/controller.js#L150
[extensions_controller_modulerender]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/controllers/controller.js#L152
[extensions_controller_render]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/controllers/controller.js#L69
[extensions_controller_renderreset]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/controllers/controller.js#L95
[extensions_controller_rendererror]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/controllers/controller.js#L98
[extensions_controller_rendercollectionfetch]:
https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/controllers/controller.js#L112
[extensions_controller_renderrenderView]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/controllers/controller.js#L96
[extensions_controller_renderView]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/controllers/controller.js#L24
[extensions_controller_renderViewnewView]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/controllers/controller.js#L28
[extensions_controller_renderViewviewrender]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/controllers/controller.js#L37

[safesync]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/mixins/safesync.js
[safesync_sync]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/mixins/safesync.js#L39

[view]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/views/view.js
[view_render]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/views/view.js#L24
[view_html]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/views/view.js#L33
[view_renderrenderSubviews]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/views/view.js#L35
[view_renderSubviews]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/views/view.js#L63
[view_renderSubviewsselector]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/views/view.js#L71-L75
[view_renderSubviewsnewView]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/views/view.js#L71-L75
[view_renderSubviewsviewrender]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/views/view.js#L96
[view_renderSubviewsviewrender]:
https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/views/view.js#L97-L99

[templates_module]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/server/templates/module.html

[table]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/views/table.js
[table_TableView]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/views/table.js#L7
[table_render]: https://github.com/alphagov/spotlight/blob/8ccd7a9cb2a1fd21ca3d33feb2e6c5791ba34343/app/extensions/views/table.js#L55


[stagecraft]: https://github.com/alphagov/stagecraft

[backbone_fetch]: http://backbonejs.org/#Model-fetch
[backbone_sync]: http://backbonejs.org/#Sync
