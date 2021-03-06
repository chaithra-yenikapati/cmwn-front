import React from 'react'; //eslint-disable-line no-unused-vars
import {expect} from 'chai';
import {shallow} from 'enzyme';

import {EditProfile} from 'routes/users/edit';
import {decodeEditingPermissions} from 'routes/users/edit';
import editSmoke from 'smoke_tests/users/edit.test.js';

import teacherData from 'mocks/users/teacher_data';
import studentDataB from 'mocks/users/student_data_b';

var checkEditEls = function (wrapper) {
    expect(wrapper.find('Layout')).to.have.length(1);
    expect(wrapper.find('Panel')).to.have.length(1);
    expect(wrapper.find('ChangePassword')).to.have.length(1);
};

var checkAdultEls = function (wrapper) {
    expect(wrapper.find('Form')).to.have.length(1);
    expect(wrapper.find('Input')).to.have.length(3);
};

var checkEditFields = function (data, currentUser) {
    var edit = <EditProfile data={data} loading={false} currentUser={currentUser} isStudent={false}/>;
    const WRAPPER = shallow(edit);

    it('updates state for edit first name', function () {
        var usernameInput = WRAPPER.find({name: 'firstnameInput'});
        expect(WRAPPER.state('first_name')).to.equal(data.first_name);
        usernameInput.simulate('change', {target: {value: 'cat'}});
        expect(WRAPPER.state('first_name')).to.equal('cat');
    });

    it('updates state for edit last name', function () {
        var usernameInput = WRAPPER.find({name: 'lastnameInput'});
        expect(WRAPPER.state('last_name')).to.equal(data.last_name);
        usernameInput.simulate('change', {target: {value: 'cat'}});
        expect(WRAPPER.state('last_name')).to.equal('cat');
    });
};

describe('Edit Profile Smoke Tests', function () {
    editSmoke();
});

describe('Edit Profile Unit Tests', function () {
    //TODO: suspend account & reset password & submit data when test mode set up for HTTPManager. LB 06/21/16.
    //TODO: test parents methods & render school info if added to render. LB 06/22/16.

    describe('teacher viewing own student\'s profile edit', function () {
        var edit = <EditProfile data={studentDataB} loading={false} currentUser={teacherData}
            isStudent={false}/>;
        const WRAPPER = shallow(edit);

        it('renders the edit profile component', function () {
            expect(WRAPPER.instance()).to.be.instanceOf(EditProfile);
        });

        it('has the correct general elements', function () {
            checkEditEls(WRAPPER);
        });

        it('has the correct adult view elements', function () {
            // TODO MPR, 8/19/16: Renable this test after edit profile adult/child flow is worked out
            //checkAdultEls(WRAPPER);
        });

        // TODO MPR, 8/19/16: Renable this test after edit profile adult/child flow is worked out
        //checkEditFields(studentDataB, teacherData);
    });

    describe('teacher viewing own profile edit', function () {
        var edit = <EditProfile data={teacherData} loading={false} currentUser={teacherData}
            isStudent={false}/>;
        const WRAPPER = shallow(edit);

        it('renders the edit profile component', function () {
            expect(WRAPPER.instance()).to.be.instanceOf(EditProfile);
        });

        it('has the correct general elements', function () {
            checkEditEls(WRAPPER);
        });

        it('has the correct adult view elements', function () {
            // TODO MPR, 8/19/16: Renable this test after edit profile adult/child flow is worked out
            //checkAdultEls(WRAPPER);
        });

        checkEditFields(teacherData, teacherData);
    });

    describe('student viewing own edit profile', function () {
        var edit;
        var studentDataBB = JSON.parse(JSON.stringify(studentDataB));
        studentDataBB.scope = 2;
        edit = <EditProfile data={studentDataBB} loading={false} currentUser={studentDataBB}/>;
        const WRAPPER = shallow(edit);

        it('renders the edit profile component', function () {
            expect(WRAPPER.instance()).to.be.instanceOf(EditProfile);
        });

        it('has the correct general elements', function () {
            checkEditEls(WRAPPER);
        });
    });

    describe('viewing edit profile without permission', function () {
        it('renders a null profile', function () {
            var edit = <EditProfile data={{user_id: 0, scope: 0}} //eslint-disable-line camelcase
                loading={false} currentUser={teacherData}/>;
            const WRAPPER = shallow(edit);
            expect(WRAPPER.type()).to.equal(null);
        });
    });

    describe('viewing edit profile without data', function () {
        it('renders a null profile', function () {
            var edit = <EditProfile data={null} loading={false} currentUser={teacherData}/>;
            const WRAPPER = shallow(edit);
            expect(WRAPPER.type()).to.equal(null);
        });
    });

    describe('decoding permissions method', function () {
        it('has correct viewing permissions for a student', function () {
            var perms = decodeEditingPermissions(true);
            expect(perms.username.canView).to.be.true;
            expect(perms.firstName.canView).to.be.true;
            expect(perms.lastName.canView).to.be.true;
            expect(perms.birthday.canView).to.be.true;
            expect(perms.email.canView).to.be.false;
            expect(perms.gender.canView).to.be.false;
        });

        it('has correct editing permissions for a student', function () {
            var perms = decodeEditingPermissions(true);
            expect(perms.username.canEdit).to.be.false;
            expect(perms.firstName.canEdit).to.be.false;
            expect(perms.lastName.canEdit).to.be.false;
            expect(perms.birthday.canEdit).to.be.false;
            expect(perms.email.canEdit).to.be.false;
            expect(perms.gender.canEdit).to.be.false;
            expect(perms.canEdit).to.be.false;
        });

        it('has correct viewing permissions for an adult', function () {
            var perms = decodeEditingPermissions(false);
            expect(perms.username.canView).to.be.true;
            expect(perms.firstName.canView).to.be.true;
            expect(perms.lastName.canView).to.be.true;
            expect(perms.birthday.canView).to.be.true;
            expect(perms.email.canView).to.be.false;
            expect(perms.gender.canView).to.be.false;
        });

        it('has correct editing permissions for an adult', function () {
            var perms = decodeEditingPermissions(false);
            expect(perms.username.canEdit).to.be.true;
            expect(perms.firstName.canEdit).to.be.true;
            expect(perms.lastName.canEdit).to.be.true;
            expect(perms.birthday.canEdit).to.be.true;
            expect(perms.email.canEdit).to.be.false;
            expect(perms.gender.canEdit).to.be.false;
            expect(perms.canEdit).to.be.true;
        });

    });
});
