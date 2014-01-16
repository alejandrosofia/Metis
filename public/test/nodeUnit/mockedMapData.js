/**
 * Created by rcartier13 on 1/6/14.
 */

var address = {
  location_name: 'name',
  locationName: 'name',
  line1: 'line1',
  line2: 'line2',
  line3: 'line3',
  city: 'city',
  state: 'state',
  zip: 'zip'
}

var electionAdministration = {
  elementId: 2,
  name: 'name',
  physicalAddress: address,
  address: address
}

var data = {
  feed: {
    id: '1',
    name: 'name',
    feedStatus: 'status',
    _election: {
      date: Date('2012-09-06'),
      electionType: 'type'
    },
    _state: {
      name: 'name'
    }
  },

  source: {
    elementId: 1,
    name: 'name',
    datetime: Date('2012-09-06'),
    description: 'desc',
    organizationUrl: 'url',
    touUrl: 'tou',
    _feedContact: {
      name: 'name',
      title: 'title',
      phone: 'phone',
      fax: 'fax',
      email: 'email'
    }
  },

  election: {
    elementId: 1,
    date: Date('2012-09-06'),
    electionType: 'type',
    stateWide: 'yes',
    registrationInfo: 'info',
    absenteeBallotInfo: 'info',
    resultsUrl: 'url',
    pollingHours: 'hours',
    electionDayRegistration: 'reg',
    registrationDeadLine: Date('2012-09-06'),
    absenteeRequestDeadline: Date('2012-09-06'),
    stateId: 2,
    _state: {
      name: 'name',
      localityCount: 3
    }
  },

  state: {
    elementId: 1,
    name: 'name',
    _electionAdministration: electionAdministration
  },

  locality: {
    elementId: 1,
    name: 'name',
    type: 'type',
    _precincts: {
      length: '2'
    },
    _precinctSplits: {
      length: '2'
    },
    _electionAdministration: electionAdministration
  },

  mapFunc: {
    map: function (callback) {
      return callback(electionAdministration);
    },
    data: electionAdministration
  },

  precinct: {
    elementId: 1,
    name: 'name',
    number: 'number',
    ward: 'ward',
    mailOnly: 'mail',
    ballotStyleImageUrl: 'url',
    _streetSegments: {
      length: 'length'
    }
  },

  electoralDistrict: {
    elementId: 1,
    name: 'name',
    type: 'type',
    number: 'number'
  },

  contest: {
    elementId: 1,
    type: 'type',
    office: 'office'
  },

  streetSegments: {
    elementId: 1,
    startHourseNumber: 2,
    endHouseNumber: 3,
    oddEvenBoth: 'yes',
    nonHouseAddress: {
      houseNumber: 4,
      houseNumberPrefix: 'pre',
      houseNumberSuffix: 'suf',
      streetDirection: 'dir',
      streetName: 'street',
      streetSuffix: 'st suf',
      addressDirection: 'dir',
      apartment: 'apt',
      city: 'city',
      state: 'state',
      zip: 'zip'
    }
  },

  earlyVote: {
    elementId: 1,
    name: 'name',
    address: address,
    directions: 'dir',
    voterServices: 'voter',
    startDate: Date('2014-09-05'),
    endDate: Date('2014-10-07'),
    daysTimesOpen: 'times'
  }

//  electionAdmin: {
//    elementId: 1,
//    name: 'name',
//    physicalAddress: address,
//    mailingAddress: address,
//    electionsUrl: 'url',
//    registrationUrl: 'url',
//    amIRegisteredUrl: 'url',
//    absenteeUrl: 'url',
//
//  }
};

module.exports = data;