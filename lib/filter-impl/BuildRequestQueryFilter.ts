import {ServerFilter} from "../filter/ServerFilter";
import {FileWrapper} from "../FileWrapper"
import {Helper} from '@gota/core';
const encode = 'utf8';

function buildQueryData(request){
     if(request.url.indexOf('?')>-1){
          let query = request.query || {};
          let components = request.url.substring(request.url.indexOf('?')+1);
          components = components.split('&');
          components.forEach(component =>{
               let name = component.split('=')[0];
               let value = component.split('=')[1];
               name = decodeURIComponent(name);
               value = decodeURIComponent(value);
               if(name.endsWith('[]')){
                    name = name.substring(0, name.length - '[]'.length);
                    let array =  Helper.getDeeplyProperty(query, name) || [];
                    array.push(value);
                    Helper.setOrAddDeeplyProperty(query, name, array);
               }else{
                    Helper.setOrAddDeeplyProperty(query, name, value);
               }
          });
          request.query = query
     }
}

export class BuildRequestQueryFilter implements ServerFilter{
     async doFilter(request: any, response: any, next: Function){
          buildQueryData(request);
          await next();
     }
}