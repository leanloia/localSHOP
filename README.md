# localSHOPPPP

<br>

## Description

Search platform for small local business where you can get information about them and their products. Also you can get in touch with and save them as a favourite.

It gives you the oportunity, as a local business, for register as one and share what and where you do what you do.

<br>

## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault.
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault.
- **homepage** - As a user I want to be able to access the homepage, see what the page is about and access to other areas of it.
- **sign up** - As a user I want to sign up on the web page so that I can personalize my profile and save information for the future.
- **login** - As a user I want to be able to log in on the web page so that I can get back to my account.
- **logout** - As a user I want to be able to log out from the web page so that I can make sure no one will access my account.
- **profile page** - As a user I want to see the list of my favorite and delete them, and edit my profile as well.
- **business** - As a user I want to see the list of business filter by my preferences.
- **business details** - As a user I want to see more details of each business, be able to call them and visit their website and save it as favorites.

<br>

## Server Routes (Back-end):

| **Method** | **Route**                      | **Description**                                                          | Request - Body            |
| ---------- | ------------------------------ | ------------------------------------------------------------------------ | ------------------------- |
| `GET`      | `/`                            | Main page route. Renders home `index` view.                              |                           |
| `GET`      | `/login`                       | Renders `login` form view.                                               |                           |
| `POST`     | `/login`                       | Sends Login form data to the server.                                     | { email, password }       |
| `GET`      | `/signup`                      | Renders `signup` form view.                                              |                           |
| `POST`     | `/signup`                      | Sends Sign Up info to the server and creates user in the DB.             | { name, email, password } |
| `GET`      | `/profile/:name`             | Private route. Renders `profile` form view.                              |                           |
| `GET`      | `/profile/:name/edit`        | Private route. Renders `edit` form view.                         |                           |
| `PUT`      | `/profile/:name/edit`        | Private route. Sends edit-profile info to server and updates user in DB. | { name, email, password } |
| `DELETE`   | `/profile/:name/:businessId` | Private route. Deletes the existing favorite from the current user.      |
| `GET`      | `/business`                    | Renders `business-list` view.                                            |                           |
| `GET`      | `/business/details/:id`        | Render `business-details` view for the particular business.              |                           |
| `POST`     | `/business/details/:id`        | Send review info from form in business-details view                      |                           |
| `GET`      | `/add-business`                | Render `add-business` view.                                              |                           |
| `POST`     | `/add-business`                | Sends info through forms from `add-business` view.                       |                           |

## Wireframes
<img src="./public/images/img-readme.jpg">

## Models

User model

```javascript
{
  name: String,
  email: String,
  password: String,
  favorites: [FavoriteId],
}

```

Favorites model

```javascript
{
  placeId: String,
}

```

<br>

## MVP



## Backlog

[See the Trello board.]

<br>

## Links

### Git

The url to your repository and to your deployed project

[Repository Link](https://github.com/interstellarpf/localSHOP)

[Deploy Link]()

<br>

### Slides

The url to your presentation slides

[Slides Link]()
