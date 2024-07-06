# gan-forms-cloud-functions

### Deploy functions

```
$ firebase deploy --only functions
```

### Storage configuration

```
$ gsutil cors set cors.json gs://gan-forms.appspot.com
$ gsutil cors get gs://gan-forms.appspot.com
```
