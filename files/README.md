

<% if (travisCi) { %>
[![Build Status](https://travis-ci.org/<%= repoSlug %>.svg?branch=main)](https://travis-ci.org/<%= repoSlug %>)<% } %><% if (appveyor) { %>
[![Build status](https://ci.appveyor.com/api/projects/status/<%= appveyor %>/branch/main?svg=true)](https://ci.appveyor.com/project/<%= repoSlug %>/branch/main)<% } %>
