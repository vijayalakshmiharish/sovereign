import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { convertToSlug } from '../../utils/functions';

export const Tags = new Mongo.Collection('tags');

const TagSchema = new SimpleSchema({
  text: {
    // Tag name
    type: String,
    optional: false
  },
  keyword: {
    // Unique identifier in DB as keyword-based-slug
    type: String,
    autoValue: function() {
      if (this.isInsert) {
        return convertToSlug(this.field('text').value);
      };
    }
  },
  url: {
     //URL that identifies this tag
    type: String,
    autoValue: function () {
      if (this.isInsert) {
        return '/tag/' + convertToSlug(this.field("text").value);
      }
    }
  },
  authors: {
    //Collection of authors that signed this contract
    type: Array,
    optional: true
  },
  "authors.$": {
    type: Object
  },
  "authors.$._id": {
    type: String,
    autoValue: function () {
      if (this.isInsert) {
        return this.userId;
      };
    }
  },
  createdAt: {
    //Creation Date
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      }
    }
  },
  lastUpdate: {
    //Last update
    type: Date,
    autoValue: function () {
      return new Date();
    }
  },
  authorized: {
    //This tag has been authorized
    type: Boolean,
    autoValue: function () {
      return true;
    }
  }
});

Tags.attachSchema(TagSchema);

/*
*  FIX: temporary workaround
*  TBD: apply security best practices
*  All to methods, validate paramenters
*/
//permissions
Tags.allow({
  insert: function (userId) {
    if (userId) {
      return true;
    }
    return false;
  },
  update: function (userId) {
    if (userId) {
      return true;
    }
    return false;
  },
  remove: function (userId) {
    if (userId) {
      return true;
    }
    return false;
  },
});
