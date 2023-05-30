
# Chatbot whatsapp

Hello everyone 👋! This application is a whatsapp chatbot integrated with mongodb, it uses mongodb to store menus and options, besides it uses a data structure, a n-ary tree for menu navigation. Also this app has an api for mongodb data management.
## Objects

#### Menus object

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `root` | `Menu` | **Required**. Menu tree root |

#### Menu object

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `keys` | `[string, ...]` | **Required**. Keys that can be used to access this menu |
| `value` | `string` | **Required**. Text to be displayed |
| `options` | `[Menu, ...]` | **Required**. Other menus |
| `menuParent` | `Menu` | **Required**. Parent menu of this menu |


## API Reference

#### Get one menu

```
   GET /chatbot/menu/get/{id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Menu ID |

#### Post add menu

This api link it use only in the first menu (root) is added, therefore, some parameters may be null.

```
   POST /chatbot/menu/add
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `keys` | `[string, ...]` | **Required**. This parameter can be null|
| `value` | `string` | **Required**. Text to be displayed |
| `menuParent` | `Menu` | **Required**. This parameter can be null |

#### Post add menu option

```
   POST /chatbot/menu/addOption/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `keys` | `[string, ...]` | **Required**. Keys that can be used to access this menu |
| `value` | `string` | **Required**. Text to be displayed |

#### Delete menu option

```
   DELETE /chatbot/menu/deleteOption/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Menu ID
