class Entity {
    constructor() {
      this._type = 'entity';
      this.getReplacedString = function(inputFeed, substr, replacedIndex) {
        const replacedFeed = inputFeed.replace(substr, `<strong>${substr}</strong>`);
        const replacedIndexNew = replacedIndex + 17;
        return { replacedFeed, replacedIndex: replacedIndexNew };
      };
    }
  }
  
  class Link {
    constructor() {
      this._type = 'link';
      this.getReplacedString = function(inputFeed, substr, replacedIndex) {
        const replacedFeed = inputFeed.replace(substr, `<a href="${substr}">${substr}</a>`);
        const replacedIndexNew = replacedIndex + (15 + substr.length);
        return { replacedFeed, replacedIndex: replacedIndexNew };
      };
    }
  }
  
  class Username {
    constructor() {
      this._type = 'username';
      this.getReplacedString = function(inputFeed, substr, replacedIndex) {
        const replacedFeed = inputFeed.replace(substr, `<a href="http://twitter.com/${substr}">${substr}</a>`);
        const replacedIndexNew = replacedIndex + 34 + substr.length;
        return { replacedFeed, replacedIndex: replacedIndexNew };
      };
    }
  }
  
  class Typefactory {
    constructor() {
      this.createTypeObject = function(type) {
        let resultObj;
        if (type === 'entity') resultObj = new Entity();
        else if (type === 'link') resultObj = new Link();
        else if (type === 'username') resultObj = new Username();
        else {
          resultObj.getReplacedString = function(inputFeed, substr, replacedIndex) {
            return { inputFeed, replacedIndex };
          };
        }
  
        return resultObj;
      };
    }
  }
  
  /**
  * @description A function that will string of Twitter feed and an object with array of indices and type and return an object of equal representation.
  * @param {string} feed - A string of Twitter feed.(Output of Module 1)
  * @param {array<object>} feedMap - Array of objects(Output of Module 2)
  * @returns {string} - Returns an string with decorated html tags
  * @example feedDecorator('Obama visited Facebook headquarters: http://bit.ly/xyz @elversatile', [{startIndex: 14, endIndex: 22, type: 'entity'}, {startIndex: 0, endIndex: 5, type: 'entity'}, {startIndex: 55, endIndex: 67, type: 'username'}, {startIndex: 37, endIndex: 54, type: 'link'}]) = "<strong>Obama</strong> visited <strong>Facebook</strong> headquarters: <a href="http://bit.ly/xyz">http://bit.ly/xyz</a> <a href="http://twitter.com/@elversatile">@elversatile</a>"
  */
  export function feedDecorator(feed, feedMap) {
    const feedMapSorted = feedMap.sort((a, b) => a.startIndex < b.startIndex ? -1 : a.startIndex > b.startIndex ? 1 : 0);
  
    let inputFeed = feed;
  
    let replacedIndex = 0;
    feedMapSorted.forEach(feedObj => {
      const startIndex = feedObj.startIndex + replacedIndex;
      const endIndex = feedObj.endIndex + replacedIndex;
      const substr = inputFeed.substring(startIndex, endIndex);
  
      //Have implemented Factory design Pattern which will create the respective object based on the Type inputed. While extending the module we can add respective classes for the newly introduced types with corresponding functionality.
      const factoryObj = new Typefactory();
      const obj = factoryObj.createTypeObject(feedObj.type);
  
      const replacedObject = obj.getReplacedString(inputFeed, substr, replacedIndex);
      inputFeed = replacedObject.replacedFeed;
      replacedIndex = replacedObject.replacedIndex;
    });
  
    return inputFeed;
  }
  
  