import React from 'react';

const Card = (props) => {
    return (
        <div className="row">
            <div className="col-12">
                {/* Default box */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">{props.titulo}</h3>
                        <div className="card-tools">
                            <button type="button" className="btn btn-tool" data-card-widget="collapse" title="Collapse">
                                <i className="fas fa-minus" />
                            </button>
                        </div>
                    </div>
                    <div className="card-body">
                    {props.children}
                    </div>
                    {/* /.card-body */}
                    <div className="card-footer">
                        {props.pie}
                    </div>
                    {/* /.card-footer*/}
                </div>
                {/* /.card */}
            </div>
        </div>

    );
}

export default Card;