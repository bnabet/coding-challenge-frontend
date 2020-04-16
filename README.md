# Leah Front-End Coding Challenge

Welcome to Leah Front-End coding challenge!

Your challenge will be to develop a microsite allowing interaction with a [FHIR](https://fr.wikipedia.org/wiki/Fast_Healthcare_Interoperability_Resources) test API.
This challenge is composed of 5 levels of difficulty which will be listed below.

## Guidelines

- Challenge is submitted as pull request against this repo ([fork it](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) and [create a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork)).
- The microsite should be deployed to the PaaS of your choice.
- You must solve the levels in ascending order.
- You must commit your code at the end of each level.

You can have a look at the higher levels, but do the simplest thing that could work for the level you're currently solving.
Each level uses the previous one, you can reuse your old code.
Don't hesitate to write shameless code at first, and then refactor it in the next levels.

### Bonus

- Decent UX and UI (responsiveness...).
- Internationalization (English, French...).

### Things that are important to us

- Code quality, maintainability and readability.

## Level 1

The purpose of this first level is to retrieve resources from the following API http://hapi.fhir.org/baseDstu3/Practitioner and to display the name of each practitioner.

When this is done, you can move on to the next step.

## Level 2

The purpose of this second level is to display detailed information about each practitioner. You have several possibilities, either you have stored the information of each practitioner beforehand (at the first API call), or you can call a new route to retrieve the information of a particular practitioner from his ID, as follows: `http://hapi.fhir.org/baseDstu3/Practitioner/:practitionerId`

When this is done, you can move on to the next step.

## Level 3

The purpose of this third level is to update the practitioner information that you previously retrieved and displayed in the previous step. The API provided at the beginning of this challenge allows the modification of each entity.

To do this, you will need to pass a specific `Content-Type` to FHIR which is `application/fhir+json`.

As well as an object containing all the practitioner's information and also the information you modified (⚠️, if you don't return all the practitioner's information, it will be deleted).
The object looks like this:

```
{
  "resourceType": "Practitioner",
  "id": practitionerId,
  "meta": {
    "extension": [...],
  },
  "identify." [...],
  "name." [...],
  "telecom": [...],
}
```

When this is done, you can move on to the next step.

## Level 4

The goal of this fourth level happens this time at the first level you have developed. As you have seen, when retrieving practitioner information, the API limits us to 20 results, so the idea is to develop a pagination in order to display more practitioners.

To do this, when retrieving this first call, you must have seen an object in the answer that corresponds to this one:

```
"link": [{
  "relationship": "self."
  "url": "http://hapi.fhir.org/baseDstu3/Practitioner"
}, {
  "relationship": "next."
  "url": "http://hapi.fhir.org/baseDstu3?_getpages=SEARCH_ID&_getpagesoffset=20&_count=20&_pretty=true&_bundletype=searchset"
}],
```

The goal here is to go after the next relationship.
Be careful, the `SEARCH_ID` is generated on every call.

When this is done, you can move on to the next step.

## Level 5

The purpose of this fifth level (the last one, courage 👊) is now to develop a search for practitioners. The research should be done by the given name.

On the first page you have developed, you will now be able to add a search field to perform the search.

The query can be done simply as below:

`http://hapi.fhir.org/baseDstu3/Practitioner?given=YOUR_TERMS&_format=json&_pretty=true`

You can now display the results in the previously retrieved listing!

### Congratulations 🥳

You've completed all the levels! Don't forget to submit your pull request so we can review your challenge and get back to you as soon as possible.

Thank you very much for your participation,
Team Leah
