import React from 'react'; // eslint-disable-line no-unused-vars
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { Profile } from 'routes/classes/profile';

import teacherData from 'mocks/users/teacher_data';
import classData from 'mocks/users/class_data';


var checkElementsTeacher = function (data, currentUser){
    var profile = <Profile data={data} loading={false} currentUser={currentUser}/>;
    const WRAPPER = shallow(profile);
    var layout = WRAPPER.find('Layout');
    expect(WRAPPER.instance()).to.be.instanceOf(Profile);
    expect(layout).to.have.length(1);
};

var checkElementsNullData = function (currentUser){
    var profile = <Profile data={null} loading={false} currentUser={currentUser}/>;
    const WRAPPER = shallow(profile);
    expect(WRAPPER.instance()).to.be.instanceOf(Profile);
    expect(WRAPPER.children()).to.have.length(0);
};

describe('class <Profile />', function (){ // eslint-disable-line no-undef
    describe('check elements', function (){ // eslint-disable-line no-undef
        it('checks profile as teacher', function (){ // eslint-disable-line no-undef
            checkElementsTeacher(classData, teacherData);
        });
        it('checks profile with null data', function (){ // eslint-disable-line no-undef
            checkElementsNullData(teacherData);
        });
    });
});
