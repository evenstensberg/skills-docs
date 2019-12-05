# Vue.js Integration

To install client libraries:

``` js
npm install @skills/skills-client-vue --save
```

This will give you access to 
1. Skills Display - Visualize your website users' skill profile
1. Skill Event Reporting - Report skill events using Vue.js directives or JS utility 
1. Skills Configuration - Global configuration used by Skills utilities.

## Skills Configuration

<import-content path="/skills-client/common/skillsConfiguration/vuejs/clientConfig.html"/>

## Skills Display

<import-content path="/skills-client/common/skillsDisplayIntro.html"/>

The previously installed ```skills-client-vue``` library is packaged with the Skills Display component. 

Usage is trivial:
1. Import SkillsDisplay component: ```import { SkillsDisplay } from '@skills/skills-client-vue';```
1. Utilize SkillsDisplay component: ```<skills-display/>```

Here is a full example of a Vue.js single-file component that uses SkillsDisplay: 

``` js{3,8,11}
<template>
    <div class="container">
        <skills-display/>
    </div>
</template>

<script>
    import { SkillsDisplay } from '@skills/skills-client-vue';
    export default {
        name: "ShowSkills",
        components: {SkillsDisplay},
    }
</script>
``` 

If you are taking advantage of [Skills Versioning](/dashboard/user-guide/skills.html#skills-versioning) then you need to provide the version property to 
the SkillsDisplay component:

``` js
<skills-display :version="currentVersion"/>
```

 SkillsDisplay component properties:

<import-content path="/skills-client/common/skillsDisplayArguments.html"/>

### Skills Display Options Object

<import-content path="/skills-client/common/skillsDisplayOptionsObject.html"/>

### Skills Display Theme Object

<import-content path="/skills-client/common/slillsDisplayTheme.html"/>

## Skill Event Reporting 

The ```skills-client-vue``` library is packaged with the ability to report skill events using either Vue.js directives or the JS utility. 

### v-skill directive 

Globally install the directive, we suggest placing it in your application's entry point such as main.js or App.vue: 

``` js
import { SkillsDirective } from '@skills/skills-client-vue';

Vue.use(SkillsDirective);
``` 

Now you can use the v-skills directive to report skill events, the following example will report an event for a skill with id 'IronMan' when the button is clicked:

``` js
<button v-skills="'IronMan'">Report Skill</button>
```

By default, the v-skills directive will utilize a click event, so the following code is functionally equivalent to the example above:

``` js
<button v-skills:click="'IronMan'">Report Skill</button>
```

The v-skills directive supports any arbitrary event, here is an example of input event: 

``` js
<input type="text" v-skills:input="\'Thor\'"/>
```  

For an extensive list of events take a look at [Mozilla's documentation](https://developer.mozilla.org/en-US/docs/Web/Events). 

The Skills service add-skill-event endpoint responds with a comprehensive metatdata object describing how that skill influenced the user's skills posture. 
The v-skills directive provides a way to capture that result via a callback method, for example: 

``` js{3}
<input type="text" 
    v-skills:input="'Thor'" 
    @skills-report-response="onReporterResponse"/>
```

and then let's say:

``` js
onReporterResponse(response) {
   // do what you need with response object
},
```

a response object may look something like this:
``` js
{
  "success": true,
  "skillApplied": true,
  "explanation": "Skill event was applied",
  "completed": []
}
```

For a full description of the response object please see [Endpoint Result Object](/skills-client/endpoints.html#endpoint-result-object).

There are times when the HTTP call could fail, such as access denied or internal server error.  You can
also listen on the @skills-report-error event to handle these situations.

``` js{4}
<input type="text" 
    v-skills:input="'Thor'" 
    @skills-report-response="onReporterResponse"
    @skills-report-error="onReporterError" />
```

### SkillsReporter JS utility 
  
If you find that the v-skills directive is not meeting your needs then there is always the JS utility to report skills: 

``` js
import { SkillsReporter } from '@skills/skills-client-vue';

SkillsReporter.reportSkill(skillId)
    .then((res) => {
        // res = metatdata describing how that skill influenced user's skills posture
    })
    .catch((err) => {
        // err = object describing why this error occrued
    });
```

### Global Event Handling

<import-content path="/skills-client/common/skillsReporter/globalEventHandling.html"/>

Here is a full example that registers and handles an event by displaying a toast message: 

``` js
methods: {
    registerToDisplayProgress() {
        const myGlobalSuccessHandler = (result) => {
          if (result.completed) {
            event.completed.forEach((completedItem) => {
              this.handleEvent(completedItem);
            });
          }
        };
        SkillsReporter.addSuccessHandler(myGlobalSuccessHandler);
    },
    handleEvent(completedItem) {
        let title = '';
        let msg = '';
        switch (completedItem.type) {
        case 'Overall':
          title = `Level ${completedItem.level}!!!!`;
          msg = `Wow! Congratulations on the Overall Level ${completedItem.level}!`;
          break;
        case 'Subject':
          title = 'Subject Level Achieved!!';
          msg = `Impressive!! Level ${completedItem.level} in ${completedItem.name} subject!`;
          break;
        case 'Skill':
          title = 'Skill Completed!!';
          msg = `Way to complete ${completedItem.name} skill!!!`;
          break;
        case 'Badge':
          title = `${completedItem.name}!!!`;
          msg = `You are now a proud owner of ${completedItem.name} badge!!!`;
          break;
        default:
          title = 'Completed!!';
          msg = `Way to finish ${completedItem.name}!`;
        }
        
        this.displayToast(msg, title);
    },
}
```
Please note that displayToast implementation is omitted as that will be specific to your application. 

### Report Event By Listening to Routes

While the skills client library doesn't provide an automatic way to report skills based on route changes it is quite 
easy to implement if you are using [Vue Router](https://router.vuejs.org/). Here is an example using Vue Router 
[Global After Hooks](https://router.vuejs.org/guide/advanced/navigation-guards.html#global-after-hooks):

```js
import Vue from 'vue';
import Router from 'vue-router';
import { SkillsReporter, SkillsConfiguration } from '@skills/skills-client-vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage,
      meta: {
        reportSkillId: 'ViewHomePage',
      },
    },
  ],
});

router.afterEach((to) => {
  if (to.meta.reportSkillId) {
    SkillsConfiguration.afterConfigure()
      .then(() => {
        SkillsReporter.reportSkill(to.meta.reportSkillId);
      });    
  }
});
```  