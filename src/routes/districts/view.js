import React from 'react';
import _ from 'lodash';
import {Panel} from 'react-bootstrap';
import { connect } from 'react-redux';

import Layout from 'layouts/two_col';
import EditLink from 'components/edit_link';
import Toast from 'components/toast';
import QueryString from 'query-string';
import Util from 'components/util';
import History from 'components/history';
import GenerateDataSource from 'components/datasource';
import Text from 'components/nullable_text';
import {Table, Column} from 'components/table';

const DISTRICT_CREATED = 'Disctrict created successfully';
const HEADINGS = {
    TITLE: 'District Administrative Dashboard: ',
    ID: 'ID',
    NAME: 'District Name',
    CODE: 'District Code',
    SYSTEM: 'School System ID',
    DESCRIPTION: 'Description',
    CREATED: 'Created',
    SCHOOLS: 'Schools in District',
    CLASSES: 'Classes in District',
    USERS: 'Users in District'
};

const PAGE_UNIQUE_IDENTIFIER = 'district-view';

const SchoolSource = GenerateDataSource('group_school', PAGE_UNIQUE_IDENTIFIER);
const ClassSource = GenerateDataSource('group_class', PAGE_UNIQUE_IDENTIFIER);
const UserSource = GenerateDataSource('org_user', PAGE_UNIQUE_IDENTIFIER);

var Component = React.createClass({
    componentDidMount: function () {
        if (QueryString.parse(location.search).message === 'created') {
            Toast.success(DISTRICT_CREATED);
        }
    },
    render: function () {
        var code = this.props.data.meta == null ? null : this.props.data.meta.code;
        var systemId = this.props.data.meta == null ? null : this.props.data.meta.system_id;
        if (this.props.data.org_id == null || !Util.decodePermissions(this.props.data.scope).update) {
            return null;
        }
        return (
            <Layout>
                <Panel header={HEADINGS.TITLE + this.props.data.title} className="standard">
                    <EditLink base="/district" uuid={this.props.data.org_id} canUpdate={Util.decodePermissions(this.props.data.scope).update} />
                    <br />
                    <Text label={`${HEADINGS.NAME}: `} text={this.props.data.title}><p></p></Text>
                    <br />
                    <Text label={`${HEADINGS.CODE}: `} text={code}><p></p></Text>
                    <br />
                    <Text label={`${HEADINGS.SYSTEM}: `} text={systemId}><p></p></Text>
                    <br />
                    <Text label={`${HEADINGS.DESCRIPTION}: `} text={this.props.data.description}><p></p></Text>
                </Panel>
                <Panel header={HEADINGS.SCHOOLS} className="standard">
                    <a onClick={() => History.push('/schools')}>View All Your Schools</a>
                    <SchoolSource>
                        <Table>
                            <Column dataKey="title"
                                renderCell={(data, row) => (
                                    <a onClick={() => History.push('/school/' + row.group_id)}>{_.startCase(data)}</a>
                                )}
                            />
                            <Column dataKey="description" />
                            <Column dataKey="title" renderHeader="Admin View"
                                renderCell={(data, row) => (
                                    <a onClick={() => History.push('/school/' + row.group_id + '/view')}>Admin View</a>
                                )}
                            />
                            <Column dataKey="title" renderHeader="Edit"
                                renderCell={(data, row) => (
                                    <a onClick={() => History.push('/school/' + row.group_id + '/edit')}>Edit</a>
                                )}
                            />
                        </Table>
                    </SchoolSource>
                </Panel>
                <Panel header={HEADINGS.CLASSES} className="standard">
                    <a onClick={() => History.push('/classes')}>View All Your Classes</a>
                    <ClassSource>
                        <Table>
                            <Column dataKey="title"
                                renderCell={(data, row) => (
                                    <a onClick={() => History.push('/class/' + row.group_id)}>{_.startCase(data)}</a>
                                )}
                            />
                            <Column dataKey="description" />
                            <Column dataKey="title" renderHeader="Admin View"
                                renderCell={(data, row) => (
                                    <a onClick={() => History.push('/class/' + row.group_id + '/view')}>Admin View</a>
                                )}
                            />
                            <Column dataKey="title" renderHeader="Edit"
                                renderCell={(data, row) => (
                                    <a onClick={() => History.push('/class/' + row.group_id + '/edit')}>Edit</a>
                                )}
                            />
                        </Table>
                    </ClassSource>
                </Panel>
                <Panel header={HEADINGS.USERS} className="standard">
                    <a onClick={() => History.push('/users')}>View All Your Users</a>
                    <UserSource>
                        <Table>
                            <Column dataKey="first_name" renderHeader="Name"
                                renderCell={(data, row) => (
                                    <a onClick={() => History.push('/user/' + row.user_id)}>{row.first_name + ' ' + row.last_name}</a>
                                )}
                            />
                            <Column dataKey="username" />
                            <Column dataKey="title" renderHeader="Admin View"
                                renderCell={(data, row) => (
                                    <a onClick={() => History.push('/user/' + row.user_id + '/view')}>Admin View</a>
                                )}
                            />
                            <Column dataKey="title" renderHeader="Edit"
                                renderCell={(data, row) => (
                                    <a onClick={() => History.push('/user/' + row.user_id + '/edit')}>Edit</a>
                                )}
                            />
                        </Table>
                    </UserSource>
                </Panel>
           </Layout>
        );
    }
});

const mapStateToProps = state => {
    var data = {};
    var loading = true;
    if (state.page && state.page.data != null) {
        loading = state.page.loading;
        data = state.page.data;
    }
    return {
        data,
        loading
    };
};

var Page = connect(mapStateToProps)(Component);
export default Page;

