import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTemplates, fetchTemplate } from '../store/slices/complianceSlice';
import { RootState } from '../store';
import { ComplianceTemplate, ComplianceRule } from '../types';

interface ComplianceRulesProps {
  onEditTemplate?: (id: number) => void;
  onCreateTemplate?: () => void;
  onToggleTemplateStatus?: (id: number, isActive: boolean) => void;
}

// Compliance rules component is commented out for MVP focus. Uncomment for future versions.
// const ComplianceRules: React.FC<ComplianceRulesProps> = ({
//   onEditTemplate,
//   onCreateTemplate,
//   onToggleTemplateStatus
// }) => {
//   const dispatch = useDispatch();
//   const { templates, currentTemplate, isLoading, error } = useSelector(
//     (state: RootState) => state.compliance
//   );
//   
//   const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
//   const [showRules, setShowRules] = useState(false);
//   
//   useEffect(() => {
//     // Fetch compliance templates when component mounts
//     dispatch(fetchTemplates() as any);
//   }, [dispatch]);
//   
//   // Handle view rules click
//   const handleViewRules = (templateId: number) => {
//     setSelectedTemplate(templateId);
//     setShowRules(true);
//     dispatch(fetchTemplate(templateId) as any);
//   };
//   
//   // Get template by ID
//   const getTemplateById = (id: number) => {
//     return templates.find(template => template.id === id);
//   };
//
//   if (isLoading && templates.length === 0) {
//     return <div className="p-4 text-center">Loading compliance templates...</div>;
//   }
//
//   if (error && templates.length === 0) {
//     return <div className="p-4 text-center text-danger">Error: {error}</div>;
//   }
//   
//   return (
//     <div className="row">
//       <div className="col-12 mb-4">
//         <div className="card shadow-sm">
//           <div className="card-header bg-white d-flex justify-content-between align-items-center">
//             <h5 className="mb-0">Compliance Templates</h5>
//             <button 
//               className="btn btn-primary btn-sm"
//               onClick={() => onCreateTemplate && onCreateTemplate()}
//             >
//               <i className="fas fa-plus me-1"></i> New Template
//             </button>
//           </div>
//           <div className="card-body">
//             <div className="table-responsive">
//               <table className="table table-hover">
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Category</th>
//                     <th>Version</th>
//                     <th>Rules</th>
//                     <th>Last Updated</th>
//                     <th>Status</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {templates.map(template => (
//                     <tr key={template.id}>
//                       <td>{template.name}</td>
//                       <td>{template.category}</td>
//                       <td>v{template.version}</td>
//                       <td>{template.rules.length}</td>
//                       <td>{new Date(template.updated_at || template.created_at).toLocaleDateString()}</td>
//                       <td>
//                         <div className="form-check form-switch">
//                           <input 
//                             className="form-check-input" 
//                             type="checkbox" 
//                             checked={template.is_active}
//                             onChange={() => onToggleTemplateStatus && onToggleTemplateStatus(template.id, !template.is_active)}
//                           />
//                           <label className="form-check-label">
//                             {template.is_active ? 'Active' : 'Inactive'}
//                           </label>
//                         </div>
//                       </td>
//                       <td>
//                         <button 
//                           className="btn btn-sm btn-outline-primary me-1"
//                           onClick={() => handleViewRules(template.id)}
//                         >
//                           <i className="fas fa-list"></i>
//                         </button>
//                         <button 
//                           className="btn btn-sm btn-outline-secondary"
//                           onClick={() => onEditTemplate && onEditTemplate(template.id)}
//                         >
//                           <i className="fas fa-edit"></i>
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//       
//       {showRules && selectedTemplate && (
//         <div className="col-12">
//           <div className="card shadow-sm">
//             <div className="card-header bg-white d-flex justify-content-between align-items-center">
//               <h5 className="mb-0">
//                 Rules for {getTemplateById(selectedTemplate)?.name}
//               </h5>
//               <button 
//                 className="btn btn-outline-secondary btn-sm"
//                 onClick={() => setShowRules(false)}
//               >
//                 <i className="fas fa-times me-1"></i> Close
//               </button>
//             </div>
//             <div className="card-body">
//               {isLoading && !currentTemplate ? (
//                 <div className="text-center p-4">Loading template rules...</div>
//               ) : currentTemplate ? (
//                 <>
//                   <div className="mb-3">
//                     <p className="text-muted">
//                       {currentTemplate.description}
//                     </p>
//                     <div className="d-flex mb-3">
//                       <span className="badge bg-primary me-2">v{currentTemplate.version}</span>
//                       <span className="badge bg-secondary me-2">{currentTemplate.category}</span>
//                       <span className={`badge ${currentTemplate.is_active ? 'bg-success' : 'bg-danger'}`}>
//                         {currentTemplate.is_active ? 'Active' : 'Inactive'}
//                       </span>
//                     </div>
//                   </div>
//                   
//                   <div className="table-responsive">
//                     <table className="table table-hover">
//                       <thead>
//                         <tr>
//                           <th>Type</th>
//                           <th>Description</th>
//                           <th>Pattern</th>
//                           <th>Message/Suggestion</th>
//                           <th>Severity</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {currentTemplate.rules.map((rule: ComplianceRule, index: number) => (
//                           <tr key={index}>
//                             <td>
//                               <span className={`badge ${
//                                 rule.rule_type === 'required_phrase' ? 'bg-primary' :
//                                 rule.rule_type === 'prohibited_term' ? 'bg-danger' :
//                                 rule.rule_type === 'data_pattern' ? 'bg-warning text-dark' :
//                                 'bg-info text-dark'
//                               }`}>
//                                 {rule.rule_type.replace('_', ' ')}
//                               </span>
//                             </td>
//                             <td>{rule.description}</td>
//                             <td>
//                               <code>{rule.parameters.pattern || rule.parameters.regex || '-'}</code>
//                             </td>
//                             <td>{rule.parameters.error_message || rule.parameters.suggestion || '-'}</td>
//                             <td>
//                               <span className={`badge ${
//                                 rule.parameters.severity === 'high' ? 'bg-danger' :
//                                 rule.parameters.severity === 'medium' ? 'bg-warning text-dark' :
//                                 'bg-info text-dark'
//                               }`}>
//                                 {rule.parameters.severity || 'normal'}
//                               </span>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </>
//               ) : (
//                 <div className="alert alert-info">Select a template to view its rules</div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
//
// export default ComplianceRules; 