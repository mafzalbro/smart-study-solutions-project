(admin)

example.com/blog/how-to-write-blog

/blog

/chat/[slug]/page.js
/chat/2343454

/chat/page.js

chat [slug]
-----------------------------------------------------------------------
CHAT MODULE
-- Sidebar
    - Tabs
        pdf tab
        chat tab
    - List
        Modal to del, edit current chat
    - Pagination

-- ChatHistory
-- InputArea
    - pdf modal
    - loading modal
    - textarea
    - ask ya phir submit button

-- Rate Limiting
-------------------------------------------------------------------
chat
about
contact
forget-password
    -- input email
    -- submit button
reset-password
    -- input new password
    -- submit button
---------------------------------------------------------------------
pricing
login
register
logout

JWT (json web token)

/reset-password?token=ey......
-------------------------------------------------------------------------
Login With Google
domain.com?token="ey..."
--------------------------------------------------------------------------
resources

[...resources] -- catch all segments
/resources/type/notes
[[...resources]] -- expception catch all segments
page.js
params = slug, slug2, slug3
/resources/type/notes
/resources/bsit/semester-8/notes

/resources/type/page.js

forum

/forum -- forum/page.js
/forum/... -- forum/[slug]/page.js
/forum/category -- forum/category/page.js
/forum/category/... -- forum/category/[category]/page.js

---------------

documents in MONGODB

--------------------------------------------------------------------------
left behind...

landing page
admin
dashboard
contact


-------------


client ------- server (finished html)

----------------------

/resources/page.js

admin/page.js admin/layout.js

 users/page.js
 books/page.js


 / - page.js - layout.js

 /admin - page.js - layout.js
    resources
        new/page.js
        [slug]/edit/page.js
        [slug]/delete/page.js
        /page.js
    profile
        /page.js
    users
        /page.js
    admins-list
        /page.js
    announcements
        /page.js
    contacts
        /page.js
    create-admin
        /page.js
    update-admin-profile
        /page.js
    forum
        /page.js
    notifications
        /page.js
    forum-categories
        /page.js
    login
        /page.js
    logout
        /page.js

--------------------------------------
To add new
admin/resoures/new/page.js

To edit
admin/resoures/[slug]/edit/page.js

To delete
admin/resoures/[slug]/delete/page.js

---------------------------------------------

NODEJS BASICS
JS
Server
MongoDB
Connection
Rest API
NEXTJS Fetch Data
Display